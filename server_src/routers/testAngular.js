/**
 * 用户登录
 */

'use strict'

var fs = require('fs');
var path = require('path');

var user_control = require('../controllers/users.js');
var nunjucks_control = require('../controllers/nunjucks.js');

var fn_testAngular = async(ctx,next)=>{
    var object = [{name:'测试1',no:1,p:0.1},{name:'测试2',no:2,p:0.2}];
    ctx.response.body = {string : object};
};


module.exports = {
   'GET /testangular' : fn_testAngular,
   'GET /testajax' : fn_testAngular
};