/**
 * 书籍信息表book table相关操作
 * 包括：
 * 查看书籍详细信息
 * 销量排行（前20位销量最高书籍简要信息）
 * 按书名、作者、ISBN搜索书籍
 */

var mysql = require('./mysql.js');
 


/**
 * 查看书籍详细信息
 * 传入书籍id，获取书籍详细信息
 * 直接传给前端结果
 * @param {int} id 
 * @param {*} ctx 
 */
var fn_getBookInfo = async function(id,ctx){
    var inqurySql = "SELECT * FROM book WHERE id="+id;

    var result;
    try{
        result = await mysql.select(inqurySql);
    }catch(err){
        console.log('查看书籍详细信息失败：'+err);
        ctx.response.body = {error:'查看书籍详细信息失败！'};
    }finally{
        if(result[0]){
            console.log('查找书籍详细信息成功');
            ctx.response.body = result[0];
        }
    }
};


/**
 * 查看热销书籍（前20位）
 * 直接传给前端热销书籍信息数组
 * @param {*} ctx 
 */
var fn_getSellingBooks = async function(ctx){
    var inqurySql = "SELECT id,isbn,title,author,summary,publisher,pubdate,price,cover FROM book ORDER BY salesnum DESC limit 20";

    var result;
    try{
        result = await mysql.select(inqurySql);
    }catch(err){
        console.log('查看热销书籍失败：'+err);
        ctx.response.body = {error:'查看热销书籍失败！'};
    }finally{
        if(result[0]){
            console.log('查看热销书籍成功');
            ctx.response.body = result;
        }
    }
};



/**
 * 通过ISBN查找书籍
 * 书籍存在则传给前端书籍object，不存在则传error
 * @param {int} ISBN 
 * @param {*} ctx 
 */
var fn_getBookByISBN = async function(ISBN,ctx){
    var inqurySql = "SELECT * FROM book WHERE isbn="+ISBN;

    var result;
    try{
        result = await mysql.select(inqurySql);
    }catch(err){
        console.log('通过ISBN查找书籍失败：'+err);
        ctx.response.body = {error:'通过ISBN查找书籍失败！'};
    }finally{
        if(result){
            console.log('通过ISBN查找书籍成功');
            ctx.response.body = result;
        }
    }
};



/**
 * 通过作者查找书籍
 * 若书籍存在返回给前端书籍数组，不存在则返回error
 * @param {string} author 
 * @param {*} ctx 
 */
var fn_getBookByAuthor = async function(author,ctx){
    var inqurySql = "SELECT * FROM book WHERE author LIKE '%"+author+"%'";

    var result;
    try{
        result = await mysql.select(inqurySql);
    }catch(err){
        console.log('通过作者查找书籍失败：'+err);
        ctx.response.body = {error:'通过作者查找书籍失败！'};
    }finally{
        if(result){
            console.log('通过作者查找书籍成功');
            ctx.response.body = result;
        }
    }
};



/**
 * 通过书名查找书籍
 * 若书籍存在则返回给前端书籍数组，不存在则返回error
 * 返回promise对象
 * @param {string} title 
 * @param {*} ctx 
 */
var fn_getBookByTitle = async function(title,ctx){
    var inqurySql = "SELECT * FROM book WHERE title LIKE '%"+title+"%'";

    var result;
    try{
        result = await mysql.select(inqurySql);
    }catch(err){
        console.log('通过书名查找书籍失败：'+err);
        ctx.response.body = {error:'通过书名查找书籍失败！'};
    }finally{
        if(result){
            console.log('通过书名查找书籍成功');
            ctx.response.body = result;
        }
    }
};



module.exports = {
    getBookInfo : fn_getBookInfo,
    getSellingBooks : fn_getSellingBooks,
    getBookByISBN : fn_getBookByISBN,
    getBookByAuthor : fn_getBookByAuthor,
    getBookByTitle : fn_getBookByTitle
};