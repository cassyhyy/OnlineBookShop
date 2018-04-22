/**
 * 搜索书籍
 */

'use strict'

var fs = require('fs');
var path = require('path');

var book_control = require('../controllers/book.js');



//搜索
var fn_search = async(ctx, next) => {
    let type = ctx.request.body.type;
    let value = decodeURI(ctx.request.body.value);

    console.log('search----type:'+type+',value:'+value)

    if(type == 1){
        //按书名搜索
        await book_control.getBookByTitle(value,ctx);
    }else if(type == 2){
        //按作者搜素
        await book_control.getBookByAuthor(value,ctx);
    }else if(type == 3){
        //按ISBN搜索
        await book_control.getBookByISBN(value,ctx);
    }else{
        ctx.response.body = {error:'搜索错误！'};
    }
};



module.exports = {
    'POST /book/search' : fn_search
};