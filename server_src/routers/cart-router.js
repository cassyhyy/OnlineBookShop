/**
 * 购物车路由
 * 包括查看购物车
 * 加入购物车
 */


'use strict'

var fs = require('fs');
var path = require('path');

var cart_control = require('../controllers/cart.js');


//添加书籍至购物车
var fn_addBook = async(ctx,next)=>{
    var id = ctx.request.body.id;
    var cart_id = ctx.request.body.cart_id;
    var amount = ctx.request.body.amount;

    await cart_control.addBookInCart(id,cart_id,amount,ctx);
};

//查看购物车
var fn_getCart = async(ctx,next)=>{
    var cart_id = ctx.request.body.cart_id;

    await cart_control.getCart(cart_id,ctx);
}

//删除书籍，更新购物车
var fn_deleteBook = async(ctx,next)=>{
    var cart_id = ctx.request.body.cart_id;
    var book_id = ctx.request.body.book_id;

    await cart_control.deleteBookInCart(cart_id,book_id,ctx);
}

module.exports = {
    'POST /cart/add' : fn_addBook,
    'POST /cart/get' : fn_getCart,
    'POST /cart/delete' : fn_deleteBook
};