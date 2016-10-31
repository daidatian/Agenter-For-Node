/*!
 * node接口路由配置
 */
 
var agenter = require("../../utils/agenter/index");
var transApi = agenter.TransApi(); // 转换接口方法模块
var cusMode = require('./customMode'); // 自定义接口返回方法（自定义res.send()方法）
var monitor = require('./monitor'); // 监控方法

module.exports = function(app){
	transApi({
		router: app,
		reqMode: 'all',
		cusMode: cusMode,
		monitor: monitor
	});
}

