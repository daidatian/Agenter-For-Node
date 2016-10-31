/*!
 * 接口拦截器（组装数据返回和设置cookie返回）
 */

var sendMode = {};

//默认返回方式（不做任何处理）

/**
 * send()方法
 * @param {object} req request对象
 * @param {object} res response对象
 * @param {Function} data 页面端接口返回的数据
 */
 
// 默认拦截器
sendMode.defaultMode = {
	send: function(req, res, data){
		res.send(data);
	}
};

// 设置会话拦截器
sendMode.setCkMode = {
	send: function(req, res, data){
		res.cookie('agent_session', 'you are asking the interface which sendMode is setCkMode');  // 设置会话cookie返回
		res.send(data);
	}
};

module.exports = sendMode;
