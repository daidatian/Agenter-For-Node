/*!
 *发送http请求模块
 */

var httpUtils = require('./httpClientUtils');

/**
 * http请求方法
 * @param {object} setting 接口配置
 * @param {object} req request对象（或仿request对象）
 * @param {Function} callback 回调函数
 */
var transfer = function(setting, req, callback) {
    var options = setting || {};
    var hds = setting.headers || {}; // 文档配置的headers
    for (var i in hds) {
        req.headers[i] = hds[i];
    }
    options.headers = req.headers;
    // 转发用户信息
    // if (req.headers['cookie']) {
    //     options.headers['Cookie'] = req.headers['cookie'];
    // }
    var reqData = req.data || req.query || req.body;
    if (setting.method == "GET") {
        httpUtils.get(options, reqData, callback);
        return;
    } else if (setting.method == "POST") {
        httpUtils.post(options, reqData, callback);
        return;
    } else {
        console.log('method of interface ' + options.id + ' is not supported'); 
        callback();
        return;
    }
    
};

module.exports = transfer;