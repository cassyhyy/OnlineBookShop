/**
 * 用户模块
 * 包括：
 * 用户注册
 * 用户登录
 * 修改密码
 * 获取用户订单
 * 获取用户购物车等等
 */

'use strict'

var mysql = require('./mysql.js');

var currentUser = 0; //当前用户id，默认为0（即匿名用户）


/**
 * 根据cookie判断当前有无登陆用户（即是匿名还是会员）
 * 匿名用户cookie中user_id==0
 * 匿名返回false，会员返回true
 * @param {*} ctx
 */
var fn_isLogined = function(ctx){
    if(ctx.cookies.get('account') != null){
        var user_id = ctx.cookies.get('account');
        console.log('当前登陆用户id：'+user_id);
        if(user_id != 0){
            console.log(user_id + " had logined.");
            return true;
        }
    }
    return false;
};


/**
 * 返回当前用户，若是会员将currentUser赋值为user_id
 * @param {*} ctx
 */
var getCurrentUser = function(ctx){
    if(fn_isLogined(ctx) === true){
        currentUser = ctx.cookies.get('account');
    }
    return currentUser;
};


/**
 * 注册，插入信息到user表中
 * 包括对该注册用户新增其购物车
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 */
var fn_register = async function(ctx,username,password,email){
    var addSql = 'INSERT INTO user VALUES(0,?,?,?)';
    var addSqlParams = [username,password,email];

    var result;
    //连接池方式导入到Mysql中
    try{
        result = await mysql.insert(addSql, addSqlParams);
    }catch(err){
        console.log('注册失败：'+err);
        ctx.response.body = {error:'注册失败'};
    }finally{
        if(result){
            var id;
            try{
                id = await mysql.select("SELECT MAX(id) as max FROM user");//返回自增id，为下一步新增购物车做准备（此方法不适用于并发操作）
            }catch(err){
                console.log('获取MAX id失败：'+err);
                ctx.response.body = {error:'注册失败'};
            }finally{
                if(id[0]){
                    //新增购物车操作
                    addSqlParams = [parseInt(id[0].max)];
                    addSql = "INSERT INTO cart VALUES(0,?)";
                    if(await mysql.insert(addSql,addSqlParams)){
                        console.log('注册用户的购物车添加成功！');
                        ctx.response.body = '注册成功！';
                    }
                }
            }
        }
    }
};


/**
 * 用户登录
 * @param {string} username 
 * @param {string} password 
 */
var fn_login = async function(ctx,username,password){
    var inqurySql = "SELECT id,password FROM user WHERE name='"+username+"'&& password='"+password+"'";

    var result;
    try{
        result = await mysql.select(inqurySql);
    }catch(err){
        console.log('登录失败：'+err);
        ctx.response.body = {error:'登录失败！'};
    }finally{
        if(result){
            console.log('登录成功');
            //写入cookie
            ctx.cookies.set(
                'account', 
                result[0].id,
                {
                domain: 'localhost',  // 写cookie所在的域名
                path: '/',       // 写cookie所在的路径
                signed : false,
                maxAge: 10 * 60 * 5000, // cookie有效时长
                expires: new Date('2018-03-15'),  // cookie失效时间
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
                }
            );
            
            result = await mysql.select("SELECT id FROM cart WHERE user_id="+result[0].id);//获取购物车id
            //购物车cookie
            ctx.cookies.set(
                'cart_id', 
                result[0].id,
                {
                domain: 'localhost',  // 写cookie所在的域名
                path: '/',       // 写cookie所在的路径
                maxAge: 10 * 60 * 5000, // cookie有效时长
                signed : false,
                expires: new Date('2018-03-15'),  // cookie失效时间
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
                }
            );
            ctx.response.body = '登录成功！';
        }
    }
};


/**
 * 修改密码
 * @param {string} oldp 
 * @param {string} newp 
 */
var fn_modifyPassword = async function(oldp,newp){
    let user_id = getCurrentUser();
    var Sql = "UPDATE user password=? WHERE password='"+oldp+"'id="+user_id;
    var param = [newp];

    var result;
    try{
        result = await mysql.update(Sql,newp);
    }catch(err){
        console.log('修改密码失败：'+err);
        ctx.response.body = {error:'原密码输入错误！请重新输入！'};
    }finally{
        if(result){
            console.log('修改密码成功');
            ctx.response.body = '修改密码成功！';
        }
    }
};


/**
 * 查看订单
 * 匿名用户返回错误，会员返回订单信息
 * @param {*} ctx 
 */
var fn_getOrder = async function(ctx){
    if(getCurrentUser(ctx) != 0){
        var inqurySql = "";
        
        var result;
        try{
            result = await mysql.select(inqurySql);
        }catch(err){
            console.log('获取订单错误：'+err);
            ctx.response.body = '获取订单失败！';
        }finally{
            if(result){
                console.log('获取订单成功');
                ctx.response.body = '获取订单成功！';
            }
        }
    }
};







module.exports={
    getCurrentUser : getCurrentUser,
    register : fn_register,
    login : fn_login,
};