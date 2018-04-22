/**
 * 利用豆瓣API获取大量书籍信息
 * 并导入mysql数据库中
 */
var https = require('https');
var iconv = require("iconv-lite");  
var mysql = require('./mysql.js');


/**
 * 传入id,通过https请求获取书籍信息
 * @param {int} id 
 */
var fn_getBooksFromHttps = async function(id){
    var url="https://api.douban.com/v2/book/"+id+"?fields=id,title,author,images,pubdate,publisher,isbn13,summary,price";  
    var json = '';  
    
    https.get(url, function(res) {  
        res.on('data', function (data) {  
            json += data;
        });  
        
        res.on("end", function () {  
            json = JSON.parse(json);
           
            //获取变量，生成sql语句
            var isbn = json.isbn13 || 0000000000000;
            var title = json.title || '';
            var author = json.author[0] || '';
            var summary = json.summary || '';
            var publisher = json.publisher || '';
            var pubdate = json.pubdate || '';
            var price = json.price || 20.0;
            if(price.indexOf('元')){
                price = price.substring(0,price.length-1);
            }
            var cover = json.images.large || '';
            var salesnum = Math.floor(Math.random()*400); //在0-399之间产生一个随机数，为销量
            var stocknum = Math.floor(Math.random()*100); //在0-99之间产生一个随机数，为库存量

            var  addSql = 'INSERT INTO book VALUES(?,?,?,?,?,?,?,?,?,?,?)';
            var  addSqlParams = [id,isbn,title,author,summary,publisher,pubdate,price,cover,salesnum,stocknum];
            
            //连接池方式导入到Mysql中
            mysql.insert(addSql,addSqlParams);
        });  

    }).on("error", function (err) {  
        console.log(err.stack);  
    });
};


module.exports = {
    getBooksFromHttps : fn_getBooksFromHttps
};
