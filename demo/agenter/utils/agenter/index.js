/*!
 * agenter
 * by ddt 20160718
 */

'use strict';

var model = require('./lib/modal');
var transApi = require('./lib/transApi');
var cacheModal = require('./lib/cacheModal');
var transfer = require('./lib/transfer');
var readApi = require('./lib/readApi');

var agenter = {};

/**
 * 初始化接口文档路径配置
 * @param {object} apis require接口文档引入对象
 */
agenter.init = function(apis){
	readApi.init(apis);
};

/**
 * 后台渲染
 */
agenter.Model = function(){
	return model;
};

/**
 * 接口配置
 */
agenter.TransApi = function(){
	return transApi;
};

/**
 * 页面数据缓存
 */
agenter.CacheModal = function(){
	return cacheModal;
};

/**
 * 请求接口数据
 */
agenter.Transfer = function(){
	return transfer;
};

/**
 * 读取接口数据
 */
agenter.ReadApi = function(){
	return readApi;
};


module.exports = agenter;