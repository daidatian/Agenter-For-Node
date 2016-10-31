/**
 * @description
 * 简单上传:点击按钮,直接选择文件上传
 * @author Jinqn
 * @date 2014-03-31
 */
(function(){
    console.log('baidu:')
    console.log(baidu)
var domUtils = baidu.editor.dom.domUtils;
//需要先引入jquery.form.js
UE.plugin.register('mysimpleupload', function (){
    var me = this,
        isLoaded = false,
        containerBtn;
    
    function initUploadBtn(){
        var w = containerBtn.offsetWidth || 20,
            h = containerBtn.offsetHeight || 20,
            btnIframe = document.createElement('iframe'),
            btnStyle = 'display:block;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;';

        domUtils.on(btnIframe, 'load', function(){

            var timestrap = (+new Date()).toString(36),
                wrapper,
                btnIframeDoc,
                btnIframeBody;

            btnIframeDoc = (btnIframe.contentDocument || btnIframe.contentWindow.document);
            btnIframeBody = btnIframeDoc.body;
            wrapper = btnIframeDoc.createElement('div');
            //修改action地址
            wrapper.innerHTML = 
            '<form id="edui_form_' + timestrap + '" target="edui_iframe_' + timestrap + '" method="POST" enctype="multipart/form-data" action="' + me.getOpt('upImgPath') + '" style="' + btnStyle + '">' +
            //修改参数名
            '<input id="edui_input_' + timestrap + '" type="file" accept="image/*" name="param.file1" style="' + btnStyle + '">' +
            //增加serialNum
            '<input type="hidden" id="serialNum" value= "'+me.getOpt('serialNum') + '" name="param.serialNum" /></form>' +
            '<iframe id="edui_iframe_' + timestrap + '" name="edui_iframe_' + timestrap + '" style="display:none;width:0;height:0;border:0;margin:0;padding:0;position:absolute;"></iframe>';

            wrapper.className = 'edui-' + me.options.theme;
            wrapper.id = me.ui.id + '_iframeupload';
            btnIframeBody.style.cssText = btnStyle;
            btnIframeBody.style.width = w + 'px';
            btnIframeBody.style.height = h + 'px';
            btnIframeBody.appendChild(wrapper);

            if (btnIframeBody.parentNode) {
                btnIframeBody.parentNode.style.width = w + 'px';
                btnIframeBody.parentNode.style.height = w + 'px';
            }
            
            var form = btnIframeDoc.getElementById('edui_form_' + timestrap);
            var input = btnIframeDoc.getElementById('edui_input_' + timestrap);
            var iframe = btnIframeDoc.getElementById('edui_iframe_' + timestrap);
   
            //上传处理事件
            domUtils.on(input, 'change', function(){
                if(!input.value) return;
                var loadingId = 'loading_' + (+new Date()).toString(36);
                var imageActionUrl = me.getOpt('upImgPath');
                var allowFiles = me.getOpt('imageAllowFiles');

                me.focus();
                me.execCommand('inserthtml', '<img class="loadingclass" id="' + loadingId + '" src="' + me.options.themePath + me.options.theme +'/images/spacer.gif" title="' + (me.getLang('mysimpleupload.loading') || '') + '" >');
                //上传后回掉函数
                function callback(data){
	              try{
	            	//移除载入等待
	                  loader = me.document.getElementById(loadingId);
	                  loader.setAttribute('src', data.url);
	 		          loader.setAttribute('_src', data.url);
	//	                  loader.setAttribute('title', json.title || '');
	//	                  loader.setAttribute('alt', json.original || '');
	                  loader.removeAttribute('id');
	                  domUtils.removeClasses(loader, 'loadingclass');
	                }catch(er){
	                  showErrorLoader && showErrorLoader(me.getLang('mysimpleupload.loadError'));
	              }
	            	//重置form上传表单
	                form.reset();
	                domUtils.un(iframe, 'load', callback);
                }
                
                function showErrorLoader(title){
                    if(loadingId) {
                        var loader = me.document.getElementById(loadingId);
                        loader && domUtils.remove(loader);
                        me.fireEvent('showmessage', {
                            'id': loadingId,
                            'content': title,
                            'type': 'error',
                            'timeout': 4000
                        });
                    }
                }

                /* 判断后端配置是否没有加载成功 */
                if (!me.getOpt('imageActionName')) {
                    errorHandler(me.getLang('autoupload.errorLoadConfig'));
                    return;
                }
                // 判断文件格式是否错误
                var filename = input.value,
                    fileext = filename ? filename.substr(filename.lastIndexOf('.')):'';
                if (!fileext || (allowFiles && (allowFiles.join('') + '.').indexOf(fileext.toLowerCase() + '.') == -1)) {
                    showErrorLoader(me.getLang('mysimpleupload.exceedTypeError'));
                    return;
                }
                //iframe异步加载
                $(form).ajaxSubmit({
            		url : me.getOpt('upImgPath'),
            		type : 'post',
            		dataType : 'json',
            		success : function(data){
            			callback(data);
            		}
            	});
            });

            var stateTimer;
            me.addListener('selectionchange', function () {
                clearTimeout(stateTimer);
                stateTimer = setTimeout(function() {
                    var state = me.queryCommandState('mysimpleupload');
                    if (state == -1) {
                        input.disabled = 'disabled';
                    } else {
                        input.disabled = false;
                    }
                }, 400);
            });
            isLoaded = true;
        });

        btnIframe.style.cssText = btnStyle;
        containerBtn.appendChild(btnIframe);
    }

    return {
        bindEvents:{
            'ready': function() {
                //设置loading的样式
            	UE.utils.cssRule('loading',
                    '.loadingclass{display:inline-block;cursor:default;background: url(\''
                    + this.options.themePath
                    + this.options.theme +'/images/loading.gif\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}\n' +
                    '.loaderrorclass{display:inline-block;cursor:default;background: url(\''
                    + this.options.themePath
                    + this.options.theme +'/images/loaderror.png\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;' +
                    '}',
                    this.document);
            },
            /* 初始化简单上传按钮 */
            'mysimpleuploadbtnready': function(type, container) {
                containerBtn = container;
                me.afterConfigReady(initUploadBtn);
            }
        },
        outputRule: function(root){
        	UE.utils.each(root.getNodesByTagName('img'),function(n){
                if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr('class'))) {
                    n.parentNode.removeChild(n);
                }
            });
        },
        commands: {
            'mysimpleupload': {
                queryCommandState: function () {
                    return isLoaded ? 0:-1;
                }
            }
        }
    }
});

/* 简单上传插件 */
var editorui = baidu.editor.ui;
var editor = editorui.Dialog.editor;
editorui["mysimpleupload"] = function (editor) {
    var name = 'mysimpleupload',
        ui = new editorui.Button({
            className:'edui-for-' + name,
            title:editor.options.labelMap[name] || editor.getLang("labelMap." + name) || '',
            onclick:function () {},
            theme:editor.options.theme,
            showText:false
        });
    editorui.buttons[name] = ui;
    editor.addListener('ready', function() {
        var b = ui.getDom('body'),
            iconSpan = b.children[0];
        editor.fireEvent('mysimpleuploadbtnready', iconSpan);
    });
    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
        var state = editor.queryCommandState(name);
        if (state == -1) {
            ui.setDisabled(true);
            ui.setChecked(false);
        } else {
            if (!uiReady) {
                ui.setDisabled(false);
                ui.setChecked(state);
            }
        }
    });
    return ui;
};
})();