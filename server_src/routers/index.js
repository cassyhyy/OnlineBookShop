/**
 * 主页
 * 畅销书籍展示
 */

'use strict'

var fs = require('fs');
var path = require('path');

var book_control = require('../controllers/book.js');



//获取畅销书籍
var fn_getSellingBooks = async(ctx, next) => {
    await book_control.getSellingBooks(ctx);
};



module.exports = {
    'GET /index/sellingbooks' : fn_getSellingBooks
};