/*!
 * http请求方法类
 */

var qs = require('querystring');
var https = require('https'); 
var http = require('http'); 
var url = require('url');

/**
 * http请求参数过滤函数
 * @param  {string} type 协议类型
 * @param  {object} ops  参数对象
 * @return {object}      新的参数对象
 */
var filterParam = function(type, ops){
    var httpArr = ['host', 'port', 'path', 'method'];
    var httpsArr = ['hostname', 'port', 'path', 'method'];
    var options = {};
    if (type == 'http') {
        for (var i in ops) {
            var httpArrSize = httpArr.length;
            for (var j=0; j<httpArrSize; j++) {
                if (i == httpArr[j]) {
                    options[i] = ops[i];
                }
            }
        }
        return options;
    } else if (type == 'https') {
        for (var i in ops) {
            var httpsArrSize = httpsArr.length;
            for (var j=0; j<httpsArrSize; j++) {
                if (i == httpsArr[j]) {
                    options[i] = ops[i];
                }
            }
        }
        return options;
    }
};

module.exports = {
    /**
     * http get请求方法
     * @param  {object}   ops        请求体
     * @param  {string}   optionData 请求参数对象
     * @param  {Function} callback   回调函数
     * @return {string}              返回的的数据字符串
     */
    get: function(ops, optionData, callback){
        var rHttp; // http方法
        var options;
        if (typeof(ops) == 'object') { // 传请求对象
            options = {};
            if (ops.hostname) { // https请求
                options = filterParam('https', ops);
                rHttp = https;
            } else { // http请求
                options = filterParam('http', ops);
                rHttp = http;
            }
        } else { // 传请求链接   
            options = url.parse(ops);
            if (options.protocol == 'http:') { // http请求
                options.host = options.hostname;
                options = filterParam('http', options);
                rHttp = http;
            } else if (options.protocol == 'https:') { // https请求
                options = filterParam('https', options);
                rHttp = https;
            }
        }
        options.path += '?' + qs.stringify(optionData);
        var request = rHttp.request(options, function(resp){
            var datas = [];
            var size = 0;
            resp.on('data', function(data){
                datas.push(data);
                size += data.length;
            });
            resp.on('end', function(){
                var buff = Buffer.concat(datas, size);
                var result = buff.toString();
                if (callback) {
                    callback(result);
                }                       
            });
        });
        request.on('error', function(e) {
            callback('');
        });
        request.end();
    },
    /**
     * http post请求方法
     * @param  {object}   ops        请求体/请求链接
     * @param  {string}   optionData 请求参数对象
     * @param  {Function} callback   回调函数
     * @return {string}              返回的的数据字符串
     */
    post: function(ops, optionData, callback) {
        var rHttp; // http方法
        var options;
        if (typeof(ops) == 'object') { // 传请求对象
            options = {};
            if (ops.hostname) { // https请求
                options = filterParam('https', ops);
                rHttp = https;
            } else { // http请求
                options = filterParam('http', ops);
                rHttp = http;
            }
        } else { // 传请求链接 
            options = url.parse(ops);
            if (options.protocol == 'http:') { // http请求
                options.host = options.hostname;
                options = filterParam('http', options);
                rHttp = http;
            } else if (options.protocol == 'https:') { // https请求
                options = filterParam('https', options);
                rHttp = https;
            }
        }
        options.method = 'POST';            
        var reqData = qs.stringify(optionData);
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        options.headers['Content-Length'] = Buffer.byteLength(reqData, 'utf8');
        var request = rHttp.request(options, function(resp){
            var datas = [];
            var size = 0;
            resp.on('data', function(data){
                datas.push(data);
                size += data.length;
            });
            resp.on('end', function(){
                var buff = Buffer.concat(datas, size);
                var result = buff.toString();
                if (callback) {
                    callback(result);
                }                       
            });
        });
        request.on('error', function(e) {
            callback('');
        });
        request.write(reqData);
        request.end();
    }
};