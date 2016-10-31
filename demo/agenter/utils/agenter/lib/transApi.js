/*!
 * 配置node接口路径及其数据返回方式
 */

var readApi = require('./readApi');
var transfer = require('./transfer');

/**
 * node接口数据返回方法（调用接口返回对象）
 * @param {object} setting 自定义接口返回对象
 * @param {object} req request对象
 * @param {object} res response对象
 * @param {object} data http请求返回的数据对象
 * @param {Fucntion} monitor 监控函数
 */

var resSend = function(setting, req, res, data, monitor) {
	sendMode[setting.sendMode].send(req, res, data);
	if (setting.monitor && monitor) { // 执行监控方法
		monitor(setting, req, data);
	}
}

//自定义接口返回方法集对象
var sendMode = {};

//默认接口返回方法
sendMode.defaultMode = {
	send: function(req, res, data) {
		res.send(data);
	}
};

/**
 * 配置node接口路径方法
 * @param {object} option 配置对象 
 * @param {object} option.router express()返回的app对象，或express.Router()对象 
 * @param {string} option.reqMode 配置接口的请求方式,如 get/post/all, all代表同时配置get和post
 * @param {object} option.cusMode 自定义接口返回数据方式（组装数据或设置cookie再返回）的方法对象（返回数据到页面端前执行）
 * @param {Function} option.monitor 自定义接口监管方法（返回数据到页面端后执行）
 */

var transApi = function(option) {
	var router = option.router; 
	var reqMode = option.reqMode; 
	var monitor = option.monitor;
	reqMode = reqMode.toUpperCase(); // 转为大写
	var inters = readApi.getInters(); // 获取JSON类型的接口数组
	if (option.cusMode) {
		var cusMode = option.cusMode
		for (var m in cusMode) {
			sendMode[m] = cusMode[m];
		}
	}
	for (var i in inters) {
		(function(i) {
			var setting = readApi.getApiSetting(inters[i]); // 获取接口信息配置
			// 配置成post请求的接口
			if (reqMode == 'POST' || reqMode == 'ALL') {
				router.post(setting.localPath, function(req, res) {
					req.query = null;
					// res.setHeader('Content-Type', 'application/json'); // 设置返回数据类型
					transfer(setting, req, function(data) {
						resSend(setting, req, res, data, monitor);
					});
				});
			}
			// 配置成get请求的接口
			if (reqMode == 'GET' || reqMode == 'ALL') {
				router.get(setting.localPath, function(req, res) {
					req.body = null;
					// res.setHeader('Content-Type', 'application/json'); // 设置返回数据类型
					transfer(setting, req, function(data) {
						resSend(setting, req, res, data, monitor);
					});
				});
			}
		})(i);
	}
}

module.exports = transApi;;