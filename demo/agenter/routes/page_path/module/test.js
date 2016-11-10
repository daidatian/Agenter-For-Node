/*!
 * 测试页面配置
 */

module.exports = function(app){

	// 后台渲染测试页
	router.get('/', function(req, res) {
		// 缓存Id + 多个请求
		ModalApi('test', req, [{
			id: "Search.getItems1",
			data: {
				q: "1"
			}
		}, {
			id: "Search.getItems2",
			data: {
				q: "0"
			}			
		}], function(data) {
			res.render('test/test', {
				title: 'Express',
				json: data[0],
				json2: data[1],
			});
		});
	});


	app.use('/', router);

};