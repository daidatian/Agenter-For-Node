/*!
 * 数据缓存方法模块
 */

var Memcache = {};

// 默认缓存时间 1小时
Memcache.memcacheTime = 3600000; 

/**
 * 重置缓存对象
 */
Memcache.resetMemcache = function() {
	global.memcache = {};
	this.createMemcache = function(){
		return 'Memcache object has been created';
	}
};

/**
 * 判断缓存对象是否已创建
 */
Memcache.getMemcacheStatus = function() {
	return !!global.memcache;
};

/**
 * 创建缓存对象(缓存对象不存在才创建)
 */
Memcache.createMemcache = function() {
	if (!this.getMemcacheStatus()) {
		this.resetMemcache();
	}	
};

/**
 * 设置缓存数据
 * @param id {string} 缓存id
 * @param data {json object} 缓存数据
 * @param time {number} 缓存时间长度（ms）
 */
Memcache.setMemcache = function(id, data, time) {
	global.memcache[id] = data;
	setTimeout(function() { //默认缓存1小时
		global.memcache[id] = null;
	}, time || this.memcacheTime);
};

/**
 * 获取缓存数据
 * @param id {string} 缓存id
 */
Memcache.getMemcacheById = function(id) {
	return global.memcache[id];
};

/**
 * 获取缓存时间
 * @param time {number || string} 缓存时间
 */
Memcache.setMemcacheTime = function(time){
	time = parseFloat(time);
	if (time.toString() !== 'NaN') {
		this.memcacheTime = time;
	} else {
		console.log('Memcache time format error');
	}	
}


module.exports = Memcache;