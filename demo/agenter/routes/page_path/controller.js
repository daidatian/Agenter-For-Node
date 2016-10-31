/*!
 * 页面配置控制器
 */

module.exports = (function(){
	this.express = require('express');
	this.router = express.Router(); // 路由配置器
	this.agenter = require("../../utils/agenter/index"); // agenter工具包
	this.ModalApi = agenter.Model(); // agenter后台渲染模块
	return {
		init: function(app){		
			require('./module/test')(app); // 测试页面配置		
		}	
	}
})();