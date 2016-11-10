/*!
 * 后台数据渲染方法体
 */

var readApi = require('./readApi');
var transfer = require('./transfer');
var Memcache = require('./cacheModal');

/**
 * 数据渲染模板方法
 * @param cacheId {string} 缓存id
 * @param req {object} request对象
 * @param setting {object} 接口信息对象
 * @param callback {function} 回调函数
 */

var M = function(cacheId, req, setting, callback) {
	if (typeof cacheId != 'string') { // 不传缓存id则不缓存
		var cacheBol = false; // 设置为不缓存
		var callback = setting;
		var setting = req;
		var req = cacheId;
	} else {
		Memcache.createMemcache(); // 创建缓存对象（只会创建一次）
		var cacheBol = true; // 设置为缓存
		var memdata = Memcache.getMemcacheById(cacheId); // 获取缓存数据,有则直接返回
		if (memdata) {
			callback(memdata);
			// console.log('缓存');
			return;
		}
	}
	// console.log('非缓存');
	var data = []; // 多个接口请求返回的数据集数组
	var dataSize = 0; // 记录接口请求返回数
	for (var j = 0; j < (setting.length || 1); j++) {
		var apiId = (setting.id || setting[j].id);
		var singleSetting = readApi.getApiSettingById(apiId);
		if (singleSetting.read) {
			(function(j) {
				var reqData = req;
				reqData.data = setting.data || (setting.length ? setting[j].data : undefined);
				transfer(singleSetting, reqData, function(d) {
					if (!setting.length) { // 一个接口请求
						if (typeof(d) == 'string' && (d.indexOf('{') != 0 && d.indexOf('[') != 0)) { // 如果接口请求失败(返回的信息不是一个json对象字符串)则返回空对象
							callback({});
							return;
						}
						callback(JSON.parse(d)); // 转为json对象返回
						!cacheBol || Memcache.setMemcache(cacheId, JSON.parse(d)); // 设置缓存
						return;
					} else { // 多个接口请求
						if (typeof(d) == 'string' && (d.indexOf('{') != 0 && d.indexOf('[') != 0)) { // 如果接口请求失败(返回的信息不是一个json对象字符串)则返回空对象
							data[j] = {};
						} else {
							data[j] = JSON.parse(d);
						}
						dataSize++;
						if (setting.length == dataSize) { // 全部接口的数据一并返回
							callback(data);
							!cacheBol || Memcache.setMemcache(cacheId, data); // 设置缓存
							return;
						}
					}
				});
			})(j);
		} else { // 不存在该接口id则打印报错信息
			(function(j) {
				console.log('Interfaces ID "' + apiId + '" do not exist!');
				callback('');
				return;
			})(j);
		}
	}
};

module.exports = function(cacheId, req, setting, callback) {
	return new M(cacheId, req, setting, callback);
};