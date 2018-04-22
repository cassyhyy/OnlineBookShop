/*
    插入书籍
*/

'use strict'

var fs = require('fs');
var path = require('path');

var book_control = require('../controllers/getbooks.js');
var nunjucks_control = require('../controllers/nunjucks.js');


var fn_init = async(ctx, next) => {
    var string = '从豆瓣API获取书籍信息并插入mysql中。。。';
    
    //插入书籍
    var id = 1002091;
    var num = 0;
    while(num < 100){//100本书籍相关信息
        await book_control.getBooksFromHttps(id);
        id++;
        num++;
    }
    console.log('插入完成！');
};


module.exports = {
    'GET /insertBooks' : fn_init
}