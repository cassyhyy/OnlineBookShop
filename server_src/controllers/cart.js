/**
 * 购物车cart表相关操作
 * 包括：
 * 加入购物车
 * 查看购物车
 */
'use strict'


var mysql = require('./mysql.js');
var user_control = require('./users.js');



/**
 * 添加书籍至购物车（若书籍本身就在购物车中，则数目加1）
 * 成功则直接返回给前端string，失败则返回error
 * @param {int} book_id 
 * @param {int} cart_id 
 * @param {*} ctx 
 */
var fn_addBookInCart = async function(book_id,cart_id,amount,ctx){
    var updateSql = "UPDATE cartbooks SET amount=amount+"+amount+" WHERE cart_id=? && book_id =?";
    var params = [cart_id,book_id];
    var update;
    var result;

    try{
        update = await mysql.update(updateSql,params);
    }catch(err){
        console.log('该书籍并不在购物车中，所以进行insert操作');
        //insert操作
        var addSql = "INSERT INTO cartbooks VALUES(0,?,?,?)";
        var params = [cart_id,book_id,amount];
        try{
            result = await mysql.insert(addSql,params);
        }catch(err){
            console.log('添加购物车失败：'+err);
            ctx.response.body = {error:'添加购物车失败！'};
        }finally{
            if(result){
                console.log('添加购物车成功');
                ctx.response.body = '添加购物车成功！';
            }
        }
    }finally{
        if(update && !result){
            ctx.response.body = '添加购物车成功！';
        }
    }
};



 /**
 * 查看购物车
 * 包括会员和匿名用户
 * @param {*} ctx 
 */
var fn_getCart = async function(cart_id,ctx){
    var inqurySql = 'SELECT book.id,book.title, book.price, book.cover, cartbooks.amount FROM book,cartbooks'
                    +' WHERE cartbooks.cart_id ='+parseInt(cart_id)+' && cartbooks.book_id = book.id';
    
    var result;
    try{
        result = await mysql.select(inqurySql);
    }catch(err){
        console.log('查看购物车失败：'+err);
        ctx.response.body = {error:'查看购物车失败！'};
    }finally{
        if(result){
            console.log('查看购物车成功');
            ctx.response.body = result;
        }
    }
};


/**
 * 删除购物车中的书籍
 * @param {int} cart_id 
 * @param {int} book_id 
 * @param {*} ctx 
 */
var fn_deleteBookInCart = async function(cart_id,book_id,ctx){
    var result;
    try{
        result = await mysql.delete("DELETE FROM cartbooks WHERE cart_id="+cart_id+" && book_id="+book_id);
    }catch(err){
        ctx.response.body = {error:'删除错误'};
    }finally{
        if(result){
            ctx.response.body = '删除成功';
        }
    }
}

module.exports = {
    addBookInCart : fn_addBookInCart,
    getCart : fn_getCart,
    deleteBookInCart : fn_deleteBookInCart
};