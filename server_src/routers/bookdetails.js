/**
 * 书籍页面
 * 展示详细信息
 */

'use strict'

var fs = require('fs');
var path = require('path');

var book_control = require('../controllers/book.js');



//获取畅销书籍
var fn_getBookDetails = async(ctx, next) => {
    let id = ctx.request.body.id;
    console.log('获取书籍id:'+id);
    await book_control.getBookInfo(id,ctx);//测试！
};



module.exports = {
    'POST /book/details' : fn_getBookDetails
};