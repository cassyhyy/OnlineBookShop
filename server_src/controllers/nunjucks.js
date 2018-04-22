/**
 * 初始化nunjucks框架（配置文件在../configs/nunjucksconfig.js中）
 */
var nunjucks = require('nunjucks');
var option = require('../configs/nunjucksconfig.js');
var file = require('../configs/projectpath.js');


var env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader( file.path, option.nunjucksLoaders), option.nunjucksOpts);

module.exports = {
    env : env
};