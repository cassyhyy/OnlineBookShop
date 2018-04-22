/**
 * 订单相关操作
 * 包括：
 * 购买生成订单
 * 查看订单（只有会员用户才可用）
 */


 'use strict'


var mysql = require('./mysql.js');
var user_control = require('./users.js');


/**
 * 购物车购买生成订单
 * 只允许会员购买
 * @param {*} ctx 
 */
var fn_generateOrder = async function(user_id,books,price,amount,sum,ctx){
    if(user_id == 0){
        console.log('用户未登录，不能生成订单。');
        ctx.response.body = {error:'请先登录再购买！'};
    }else{
            //插入order表
            console.log('user_id:'+user_id+',price:'+price+',sum:'+sum);
            var orderInsert = "INSERT INTO order_table VALUES(0,?,?,?,?,?)";
            var params = [parseInt(user_id),parseInt(getTime()),parseFloat(price),0,parseInt(sum)];
            await mysql.insert(orderInsert,params);
            
            console.log('orderbooks..');
            //插入orderbooks表
            var order_id = await mysql.select("SELECT MAX(id) as max FROM order_table");
            var booksInsert = "INSERT INTO orderbooks VALUES(0,?,?,?)";
            for(var i in books){
                console.log('数量:'+amount[i]);
                var bparams = [order_id[0].max,books[i],amount[i]];
                await mysql.insert(booksInsert,bparams);
            }
            ctx.response.body = '购买成功！';
        }
};

//按照'年-月-日 时-分-秒"格式获取时间
function getTime(){
    var date = new Date();
    var month = '';
    var day = '';
    var hours = '';
    var minutes = '';
    var seconds = '';
    if(date.getMonth() < 9){
        month='0'+(date.getMonth()+1);
    }else{
        month = date.getMonth()+1;
    }

    if(date.getDate() < 10){
        day = '0'+date.getDate();
    }else{
        day = date.getDate();
    }

    if(date.getHours()<10){
        hours = '0'+date.getHours();
    }else{
        hours = date.getHours();
    }

    if(date.getMinutes()<10){
        minutes = '0'+date.getMinutes();
    }else{
        minutes = date.getMinutes();
    }

    if(date.getSeconds()<10){
        seconds = '0'+date.getSeconds();
    }else{
        seconds = date.getSeconds();
    }

    return String(''+String(date.getFullYear())+month+day+hours+minutes+seconds);
}

/**
 * 获取订单
 * @param {*} ctx 
 */
var fn_getOrders = async function(user_id,ctx){
    if(user_id == 0){
        console.log('用户未登录，不能查看订单。');
        ctx.response.body = {error:'请先登录！'};
    }else{
        var sql = "SELECT * FROM order_table WHERE user_id="+user_id;
        
        var result;
        try{
            //先获取到会员的所有订单（得到所有订单的id）
            result = await mysql.select(sql);
        }catch(err){
            console.log('获取订单失败：'+err);
            ctx.response.body = {error:'获取订单失败！'};
        }finally{
            if(result){
                console.log('获取订单成功');
                //根据所有的订单id获取相关订单信息（包括书籍信息、价格、订单时间及状态等）
                var orders = new Array();
                for(var i in result){
                    var books;
                    var sql = "SELECT book.id,book.title,book.price,book.cover,orderbooks.amount"
                              +" FROM book,orderbooks WHERE book.id=orderbooks.book_id && orderbooks.order_id="+result[i].id;
                    
                    try{
                        books = await mysql.select(sql);
                    }catch(err){
                        console.log('获取订单书籍失败：'+err);
                        ctx.response.body = {error:'获取订单失败！'};
                    }finally{
                        if(books){
                            var b = new Array();
                            for(var j in books){
                                var temp = {
                                    title : books[j].title,
                                    price : books[j].price,
                                    cover : books[j].cover,
                                    amount : books[j].amount
                                };
                                b.push(temp);
                            }
                        }
                    }
                
                    var o = {
                        books : b,//一个订单的所有书籍信息，b也是一个数组
                        id : result[i].id,
                        time : result[i].time,
                        price : result[i].price,
                        state : result[i].state,
                        amount : result[i].amount
                    };
                    orders.push(o);
                } 
                ctx.response.body = orders;
            }
        }
    }
};


/**
 * 订单结算页面，展示订单书籍
 * @param {*} ctx 
 */
var fn_payOrder = async function(ctx){

    var order = await mysql.select("SELECT MAX(id) as max FROM order_table");
    if(order[0])
    {
        let order_id = order[0].max;//订单号
        var order = await mysql.select("SELECT * FROM order_table WHERE id="+order_id);
        var books = await mysql.select("SELECT book.title,book.price,book.cover,orderbooks.amount FROM book,orderbooks WHERE orderbooks.book_id=book.id && orderbooks.order_id="+order_id);
        
        var b = new Array();
        for(var i in books){
            var p = books[i].price;
            var a = books[i].amount;
            var booksPrice = p*a;
            b.push({
                title : books[i].title,
                price : books[i].price,
                cover : books[i].cover,
                amount : books[i].amount,
                allPrice : booksPrice
            });
        }
        if(books[0]){
            console.log('订单书籍：'+books);
            var price = order[0].price;
            var amount = order[0].amount;
            var o = {
                price : price,
                amount : amount,
                books : b
            };
                ctx.response.body = o;
        }else{
            ctx.response.body = {error:'错误！'};
        }
    }
};


/**
 * 删除订单
 * @param {int} order_id 
 * @param {*} ctx 
 */
var fn_deleteOrder = async function(order_id,ctx){
    var result;
    try{
        result = await mysql.delete("DELETE FROM order_table WHERE id="+order_id);
    }catch(err){
        ctx.response.body = {error:'删除错误！'};
    }finally{
        if(result){
            ctx.response.body = '删除成功！';
        }
    }
}

module.exports = {
    generateOrder : fn_generateOrder,
    getOrders : fn_getOrders,
    payOrder : fn_payOrder,
    deleteOrder : fn_deleteOrder
};