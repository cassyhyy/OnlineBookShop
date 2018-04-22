/**
 * 与mysql建立连接，暴露pool连接池变量，便于重用连接操作
 */
var mysql = require('mysql');

var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'test',
  port : 3306
});


/**
 * 封装mysql的insert函数
 * throw错误
 * 成功则返回结果数组
 * @param {string} addSql 
 * @param {array} addSqlParams 
 */
var fn_insert = async function(addSql, addSqlParams){
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,conn){
            conn.query(addSql,addSqlParams, function(err, result){
                if(err){
                    conn.release();
                    reject('数据库错误：'+err);
                }       
                //成功
                console.log('----------------------------INSERT----------------------------');
                console.log('INSERT ID:',result);        
                console.log('----------------------------INSERT结束--------------------------\n');  
                //if(result){
                    //结果存在
                    conn.release();
                    resolve(result); //成功resolve结果对象
                /*}else{
                    //结果不存在
                    conn.release();
                    reject('结果不存在');
                }*/
            });
        });
    });
};


/**
 * 封装mysql的update函数（与insert有所区别，Update如果对象不存在也会成功返回，所以做了部分修改）
 * throw错误
 * 成功则返回结果数组
 * @param {string} Sql 
 * @param {array} Params 
 */
var fn_update = async function(Sql, Params){
  return new Promise(function(resolve,reject){
      pool.getConnection(function(err,conn){
          conn.query(Sql,Params, function(err, result){
              if(err){
                  conn.release();
                  reject('数据库错误：'+err);
              }
              //成功
              console.log('----------------------------UPDATE----------------------------');
              console.log('UPDATE ID:',result);        
              console.log('----------------------------UPDATE结束--------------------------\n');  
              if(result.changedRows != 0){
                  //结果存在
                  conn.release();
                  resolve(result);
              }else{
                  conn.release();
                  reject('结果不存在');
              }       
          });
      });
  });
};



/**
 * 封装mysql的查询函数
 * throw错误
 * 成功则返回结果数组
 * @param {string} sql 
 */
var fn_select = async function(sql){
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,conn){
            conn.query(sql, function(err, result){
                if(err){
                    conn.release();
                    reject('数据库错误：'+err);
                }       
                //成功
                console.log('----------------------------SELECT----------------------------');
                console.log('SELECT ID:',result);        
                console.log('----------------------------SELECT结束--------------------------\n');  
                if(result){
                    //结果存在
                    conn.release();
                    resolve(result); //成功resolve结果对象
                }else{
                    //结果不存在
                    conn.release();
                    reject('结果不存在');
                }
            });
        });
    });
};


/**
 * 删除
 * @param {string} sql 
 */
var fn_delete = async function(sql){
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,conn){
            conn.query(sql, function(err, result){
                if(err){
                    conn.release();
                    reject('数据库错误：'+err);
                }       
                //成功
                console.log('----------------------------DELETE----------------------------');
                console.log('DELETE ID:',result);        
                console.log('----------------------------DELETE结束--------------------------\n');  
                if(result){
                    //结果存在
                    conn.release();
                    resolve(result); //成功resolve结果对象
                }else{
                    //结果不存在
                    conn.release();
                    reject('删除失败');
                }
            });
        });
    });
};


module.exports = {
    pool : pool,
    insert : fn_insert,
    update : fn_update,
    select : fn_select,
    delete : fn_delete
};