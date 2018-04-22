/**
 * 用户注册
 */

'use strict'

var fs = require('fs');
var path = require('path');

var user_control = require('../controllers/users.js');



//注册
var fn_register = async(ctx, next) => {
    var username = ctx.request.body.username || '';
    var password = ctx.request.body.password || '';
    var email = ctx.request.body.email || '';

    console.log('注册。。。'+username);
    await user_control.register(ctx,username,password,email);
};



module.exports = {
    'POST /register/upInfo' : fn_register
};