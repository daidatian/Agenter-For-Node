/*!
 * 读取接口文档配置
 */

var interfaces;

var readApi = {};

readApi.init = function(apis){
	interfaces = apis;
}

/**
 * 获取单个接口信息配置
 * @param inter {object} 单个接口配置对象
 */
readApi.getApiSetting = function(inter) {
	var setting = inter;
	var config = inter.config || 'default'; // host/port设置，默认default
	setting.protocol = interfaces.config[config].protocol || 'http'; // 接口协议(http/https，默认为http)
	setting.protocol = setting.protocol.toLowerCase();
	if (setting.protocol == 'http') {
		setting.host = interfaces.config[config].host; // 接口host地址
		setting.port = interfaces.config[config].port || '80'; // 接口端口号（默认'80'端口）
	} else if (setting.protocol == 'https') {
		setting.hostname = interfaces.config[config].host; // 接口host地址
		setting.port = interfaces.config[config].port || '443'; // 接口端口号（默认'443'端口）
	} else {
		setting.host = interfaces.config[config].host; // 接口host地址
		setting.port = interfaces.config[config].port || '80'; // 接口端口号（默认'80'端口）
		console.log('Interface Protocol of ' + inter.config + '，"' + setting.protocol  + '", is not supported'); // 不支持该接口协议，当http协议处理
	}	
	setting.protocol = setting.protocol + ':';
	setting.namespace = interfaces.config[config].namespace || ''; // 接口项目名
	setting.path = setting.namespace + inter.action; // 接口地址（项目名+相对路径）
	setting.localPath = inter.localAction || inter.action; // node接口地址
	setting.method = inter.method.toUpperCase(); // 接口请求方法
	setting.sendMode = inter.sendMode || 'defaultMode'; // 接口自定义操作的方法（默认'defaultMode'模式）
	setting.monitor = inter.monitor || false; // 是否监控接口（默认为false, 不监控）
	setting.description = inter.description; // 接口描述
	return setting;
};


/**
 * 过滤接口方法
 * @param i {num} 单个接口index
 * @param inters {Array} 接口数组
 */
var cutInters = function(i, inters) {
	if (i == inters.length - 1) {
		inters.pop(); // 最后一个则直接删除
	} else if (i < inters.length - 1) {
		inters.splice(i, 1);
	}
	return inters;
}

/**
 * 获取该文档所有类型的接口数组
 */
readApi.getAllInters = function() {
	var inters = interfaces.interfaces.slice(0); // 此处的数组不可直接赋值，否组会改变原数组 interfaces.interfaces
	return inters;
}

/**
 * 获取该文档JSON类型的接口数组
 */
readApi.getInters = function() {
	var inters = this.getAllInters();
	for (var i = 0; i < inters.length; i++) {
		if (!!inters[i].type && inters[i].type !== "JSON") { // 过滤不是JSON类型的接口(不设置type属性则默认为JSON类型的接口)
			inters = cutInters(i--, inters);
		}
	}
	return inters;
}

/**
 * 获取单个接口的node路径配置
 * @param inter {object} 单个接口配置对象
 */
readApi.getLocalPath = function(inter) {
	return inter.localAction || inter.action;
}

/**
 * 根据接口id获取单个接口信息配置
 * @param inter {string} 接口id
 */
readApi.getApiSettingById = function(id) {
	var setting = {};
	var inters = this.getAllInters();	
	var inter;
	for (var i = 0, len = inters.length; i < len; i++) {
		if (id == inters[i].id) {
			inter = this.getApiSetting(inters[i]);
			inter.read = true; // true代表接口读取成功
			return inter;
		}
	}
	return {
		msg: 'Interfaces ID "' + id + '" do not exist!',
		read: false 
	};
}

module.exports = readApi;