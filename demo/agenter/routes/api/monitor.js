/*!
 * 用户自定义监管操作
 */

var agenter = require('../../utils/agenter/index');
var readApi = agenter.ReadApi();
var transfer = agenter.Transfer();

/**
 * 监控用户操作方法（node端调用接口）
 * @param {object} st 接口配置信息对象
 * @param {object} req request对象
 * @param {Function} data 页面端接口返回的数据
 */
 
module.exports = function(st, req, data){
	// 如果页面接口请求失败(返回的信息不是一个json对象字符串)则不执行监控
    if (typeof(data) == 'string' && (data.indexOf('{') != 0 && data.indexOf('[') != 0)) { 
		console.log('request fails, do not perform monitoring');
		return;
	} else {
		console.log('request success, start monitor');
		// 请求监控的接口...
	}	
}