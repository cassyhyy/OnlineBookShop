/**
 * 用户登录
 */

'use strict'

var fs = require('fs');
var path = require('path');

var user_control = require('../controllers/users.js');



//登录
var fn_login = async(ctx, next) => {
    var username = ctx.request.body.username || '';
    var password = ctx.request.body.password || '';

    console.log("u:"+username+",p:"+password);
    await user_control.login(ctx,username,password);
};



module.exports = {
    'POST /login/check' : fn_login
};