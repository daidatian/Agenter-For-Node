/*!
 * transmd
 * by ddt 20160718
 */

'use strict';

var model = require('./lib/modal');
var transApi = require('./lib/transApi');
var cacheModal = require('./lib/cacheModal');
var transfer = require('./lib/transfer');
var readApi = require('./lib/readApi');

var transmd = {};

/**
 * 初始化接口文档路径配置
 * @param {object} apis require接口文档引入对象
 */
transmd.init = function(apis){
	readApi.init(apis);
};

/**
 * 后台渲染
 */
transmd.Model = function(){
	return model;
};

/**
 * 接口配置
 */
transmd.TransApi = function(){
	return transApi;
};

/**
 * 页面数据缓存
 */
transmd.CacheModal = function(){
	return cacheModal;
};

/**
 * 请求接口数据
 */
transmd.Transfer = function(){
	return transfer;
};

/**
 * 读取接口数据
 */
transmd.ReadApi = function(){
	return readApi;
};


module.exports = transmd;