/**
 * 订单路由
 * 包括查看订单
 * 生成订单
 */


'use strict'

var fs = require('fs');
var path = require('path');

var order_control = require('../controllers/order.js');



//生成订单
var fn_generate = async(ctx,next)=>{
    var user_id = ctx.request.body.user_id;
    var books_id = ctx.request.body.id;
    var price = ctx.request.body.price;
    var amount = ctx.request.body.amount;
    var allamount = ctx.request.body.allamount;

    await order_control.generateOrder(user_id, books_id, price, amount, allamount, ctx);
}


//查看订单
var fn_getOrder = async(ctx,next)=>{
    var user_id = ctx.request.body.id;

    await order_control.getOrders(user_id,ctx);
}


//订单结算页面
var fn_orderPay = async(ctx,next) =>{
    await order_control.payOrder(ctx);
}


//删除订单
var fn_orderDelete = async(ctx,next)=>{
    var order_id = ctx.request.body.order_id;
    await order_control.deleteOrder(order_id,ctx)
}


module.exports = {
    'POST /order/generate' : fn_generate,
    'POST /order/get' : fn_getOrder,
    'GET /order/pay' : fn_orderPay,
    'POST /order/delete' : fn_orderDelete
};