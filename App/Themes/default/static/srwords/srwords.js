;(function (window, document) {
    var SrWords = function (target, options) {
        // 检查是否是本对象
        if(!(this instanceof SrWords)){
            return new SrWords(target, options);
        }

        // 参数合并
        this.options = this.extend({
            // 这个参数以后可能会更改所以暴露出去
            tokenKey: 'srwordscookie20180924',
            apiBase:"http://localhost:8000/api"
            // apiBase:"http://api.codegrids.com/api"
        }, options);

        // 判断传进来的是DOM还是字符串
        if((typeof target)==="string"){
            this.target = document.querySelector(target);
        }else{
            this.target = target;
        }

        // 初始化插件
        this.init();
    }
    // 构建原型链方法
    SrWords.prototype = {
        /**
         * [init 初始化插件]
         * @DateTime 2018-09-26
         * @return   {[type]}   [description]
         */
        init: function () {
            this.renderSpeakArea(0);
            this.renderHistoryMsg();
            this.renderDialog();
        },
        /**
         * [renderSpeakArea 渲染发送内容的输入框]
         * @DateTime 2018-09-30
         * @param    {[type]}   id  [description]
         * @param    {[type]}   dom [description]
         * @return   {[type]}       [description]
         */
        renderSpeakArea: function (id) {
            var targetDom = this.target;
            var submitBtn = 'srwords-speak-submit-' + id;
            var textAreaS = 'srwords-speak-text-' + id;
            if (id !== 0) {
                targetDom = this.target.querySelector('.srwords-speak-temp-' + id);
            }
            // 输入框的内容区域
            var html = '<div class="srwords-speak">';
            html += '<textarea class="srwords-speak-textarea '+textAreaS+'"></textarea>';
            html +=     '<div class="srwords-speak-options">';
            html +=         '<span class="">欢迎使用SeeruoWords</span>';
            html +=         '<span class="submit-button '+submitBtn+'">发布</span>';
            html +=     '</div>';
            html += '</div>';
            if (id === 0) {
                html += '<div class="srwords-msgs-list-area"></div>';
            }
            // 渲染完成
            targetDom.innerHTML = html;

            var _this = this;
            // 评论按钮点击事件
            var submitBtnDom = this.target.querySelector('.'+submitBtn);
            submitBtnDom.addEventListener("click",function(){
                _this.handleSubmit('.'+textAreaS, id);
            },false);

            // 内容输入事件
            var textAreaDom = this.target.querySelector('.'+textAreaS);
            textAreaDom.addEventListener("focus",function(){
                _this.handleTextAreaFocus();
            },false);
        },
        /**
         * [renderOneMessage 渲染页面内容]
         * @DateTime 2018-09-30
         * @param    {[type]}   obj [description]
         * @param    {[type]}   dom [description]
         * @return   {[type]}       [description]
         */
        renderOneMessage: function (obj, dom) {
            var _this = this;
            dom = ( typeof dom === 'undefined') ? '.srwords-msgs-list-area' : dom;
            var list_dom = this.target.querySelector(dom);

            // 评论的输入框的html
            var old_html = list_dom.innerHTML;
            var html = '<div class="srwords-msg">';
            // 评论者
            html += '<div class="srwords-msg-options">';
            html += '<span class="srwords-msg-speaker">'+ obj.speaker +'</span>';
            if (obj.speak_to) {
                html += '<span class="srwords-msg-speakto">回复</span>';
                html += '<span class="srwords-msg-speaker">'+ obj.speak_to +'</span>';
            }
            html += '<span class="srwords-msg-time">'+ obj.speak_time +'</span>';
            html += '<span class="srwords-msg-reply" data-id='+obj.id+'>回复</span>';
            html += '</div>';
            // 评论内容
            html += '<span class="srwords-msg-text">'+ obj.speak_cnt +'</span>';
            // 临时评论框插入位置
            html += '<div class="srwords-speak-temp srwords-speak-temp-'+obj.id+'"></div>';
            if (obj.children) {
                html += '<div class="srwords-msg-children srwords-msg-children-'+obj.id+'"></div>';
            }
            html += '</div>';
            html =  html + old_html;

            list_dom.innerHTML = html;

            // 渲染回复消息
            if (obj.children) {
                obj.children.forEach(function(item) {
                    var dom_str = '.srwords-msg-children-'+obj.id;
                    _this.renderOneMessage(item, dom_str);
                })
            }
        },
        /**
         * [renderHistoryMsg 获取历史消息，并渲染]
         * @DateTime 2018-09-26
         * @return   {[type]}   [description]
         */
        renderHistoryMsg: function(){
            var _this = this;
            var param = encodeURI( '?web_url=' + window.location.href );
            _this.ajax('get', this.options.apiBase+'/speak' + param, {}, function (res) {
                // 如果后端保存数据成功，开始渲染页面留言内容，在后面加一个留言dom
                if (res.status == 200) {
                    res.list.forEach(function(item, index) {
                        _this.renderOneMessage(item);
                    })
                    _this.activeReply();
                }else{
                    alert(res.msg);
                }
            }, true)
        },
        /**
         * [activeReply 绑定回复事件]
         * @DateTime 2018-09-30
         * @param    {[type]}   argument [description]
         * @return   {[type]}            [description]
         */
        activeReply() {
            // 绑定回复事件
            var _this = this;
            var reply_dom = 'srwords-msg-reply';
            var replayBtnDom = this.target.getElementsByClassName(reply_dom);
            for( let i =0; i<replayBtnDom.length; i++){
                replayBtnDom[i].addEventListener("click",function(){
                    _this.handleSpeakReply(this);
                }, true);
            }
        },
        /**
         * [renderDialog 渲染对话框]
         * @DateTime 2018-09-26
         * @return   {[type]}   [description]
         */
        renderDialog() {
            var ss = this.target;
            var dialog = document.createElement("div");
            dialog.classList.add("srwords-dialog");

            var dlg_html = '<div class="srwords-dialog-mask"></div>';
            dlg_html += '<div class="srwords-dialog-body">';
            dlg_html += '<div class="srwords-dialog-close">X</div>';
            dlg_html += '<div class="srwords-dialog-input"><span>用户登陆</span></div>';
            dlg_html += '<div class="srwords-dialog-input"><label>用户</label><input type="text" class="srwords-dialog-input-user"></div>';
            dlg_html += '<div class="srwords-dialog-input"><label>密码</label><input type="password" class="srwords-dialog-input-pass"></div>';
            dlg_html += '<div class="srwords-dialog-input"><button class="srwords-dialog-login-btn">登陆</button></div>';
            dlg_html += '<div class="srwords-dialog-linker"><a class="srwords-dialog-regist">账号注册</a><a class="srwords-dialog-forget">忘记密码?</a></div>';
            dlg_html += '</div>';
            dialog.innerHTML = dlg_html;
            ss.appendChild(dialog);
            this.bindDialogEvent();
        },
        /**
         * [bindDialogEvent 绑定对话框事件]
         * @DateTime 2018-09-26
         * @param    {[type]}   e [给元素绑定属性]
         * @return   {[type]}     [description]
         */
        bindDialogEvent: function () {
            var _this = this;

            // 关闭对话框
            var closeBtnDom = this.target.querySelector('.srwords-dialog-close');
            closeBtnDom.addEventListener("click",function(){
                _this.closeDialog()
            },false);

            // 关闭对话框
            var loginBtnDom = this.target.querySelector('.srwords-dialog-login-btn');
            loginBtnDom.addEventListener("click",function(){
                _this.handleLoginSub();
            },false);
        },
        /**
         * [handleSubmit 提交事件]
         * @DateTime 2018-09-30
         * @param    {[type]}   dom [description]
         * @return   {[type]}       [description]
         */
        handleSubmit: function(dom, pro_id) {
            var _this = this;
            var dom = this.target.querySelector(dom);
            var web_url = window.location.href,
                speak_cnt = this.srTrim(dom.value);
            if (speak_cnt === '') {
                alert('评论内容不能为空');
                return false;
            }
            var obj = {
                pro_id: pro_id,
                web_url: web_url,
                speak_cnt: speak_cnt
            }
            this.ajax('post', this.options.apiBase+'/speak', obj, function (res) {
                // 如果后端保存数据成功，开始渲染页面留言内容，在后面加一个留言dom
                if (res.status === 200) {
                    if (res.data.speak_to === '') {
                        _this.renderOneMessage(res.data);
                    }else{
                        _this.renderOneMessage(res.data, '.srwords-msg-children-'+res.data.f_id);
                    }
                    dom.value = '';
                    _this.activeReply();
                }else if (res.status === 0) {
                    _this.showDialog();
                }else{
                    alert(res.msg);
                }
            })
        },
        /**
         * [handleTextAreaFocus 输入框选中事件]
         * @DateTime 2018-09-26
         * @return   {[type]}   [description]
         */
        handleTextAreaFocus() {
            var token = this.getSrCookie(this.options.tokenKey);
            // 如果不存在key
            if ( typeof token !== 'string' || token === null) {
                this.showDialog();
                return false;
            }
        },
        handleSpeakReply(e) {
            var speak_id = e.dataset.id;
            var tag = this.target.getElementsByClassName('srwords-speak-temp');
            for( let i =0; i<tag.length; i++){
                tag[i].innerHTML = '';
            }
            // 渲染一个临时消息输入框
            this.renderSpeakArea(speak_id);
        },
        /**
         * [handleLoginSub 登陆提交]
         * @DateTime 2018-09-26
         * @return   {[type]}   [description]
         */
        handleLoginSub(){
            var _this = this;
            var user_dom = this.target.querySelector('.srwords-dialog-input-user');
            var pass_dom = this.target.querySelector('.srwords-dialog-input-pass');
            var user_value = user_dom.value;
            var pass_value = pass_dom.value;

            var param = {user: user_value, pass: pass_value};
            this.ajax('post', this.options.apiBase+'/login', param, function (res) {
                // 如果后端保存数据成功，开始渲染页面留言内容，在后面加一个留言dom
                if (res.status === 200) {
                    _this.setSrCookie(_this.options.tokenKey, res.token, 'd10');
                    _this.closeDialog()
                }else{
                    alert(res.msg);
                }
            }, true)
        },
        closeDialog(){
            var dialog = this.target.querySelector('.srwords-dialog');
            dialog.classList.remove("srwords-dialog-show");
        },
        showDialog(){
            var dialog = this.target.querySelector('.srwords-dialog');
            dialog.classList.add("srwords-dialog-show");
        },
        /**
         * [ajax js异步发送请求的方法]
         * @DateTime 2018-09-26
         * @param    {str}      method   [请求方式]
         * @param    {str}      url      [请求地址]
         * @param    {object}   data     [参数对象]
         * @param    {Function} callback [回调函数]
         * @param    {boolen}   withOutToken [取消携带token]
         * @return   {[type]}            [description]
         */
        ajax: function (method, url, data, callback, withOutToken) {
            var data = data ? data : {};
            var data_str = this.makeObj2Str(data);

            var xhr = new XMLHttpRequest() // 创建异步请求
            xhr.open(method, url, true)    // 获取方式，异步
            //发送合适的请求头信息
            if(!withOutToken){
                var token = this.getSrCookie(this.options.tokenKey);
                token = token ? token : '';
                xhr.setRequestHeader("Authorization", token); 
            }
            xhr.setRequestHeader("Accept","application/json"); 
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"); 
            // xhr.setRequestHeader("Authorization", 'Basic this is my tooken fuck');
            // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // if (typeof token === 'string' && token !== '') {
            //     xhr.setRequestHeader("Authorization", token);
            // }
            // 异步请求状态发生改变时会执行这个函数
            xhr.onreadystatechange = function () {
                // status == 200 用来判断当前HTTP请求完成
                if ( xhr.readyState == 4 && xhr.status == 200 ) {
                    callback(JSON.parse(xhr.responseText))  // 执行回调
                }
            }
            data_str = data_str ? data_str : null;
            xhr.send( data_str )  // 发送异步请求
        },
        /**
         * [makeObj2Str 把对象转为适合xhr.send的字符串]
         * @DateTime 2018-09-26
         * @param    {[type]}   data [description]
         * @return   {[type]}        [description]
         */
        makeObj2Str: function (data) {
            var string = '';
            for (var key in data) {
                string += key + '=' + data[key] + '&';
            }
            if (string){
                string = string.substring(0, string.length-1);
            }
            return string;
        },
        /**
         * [extend 对象合并]
         * @DateTime 2018-09-26
         * @param    {[type]}   obj  [description]
         * @param    {[type]}   obj2 [description]
         * @return   {[type]}        [description]
         */
        extend: function(obj,obj2){
            for(var k in obj2){
                obj[k] = obj2[k];
            }
            return obj;
        },
        /**
         * [setSrCookie 设置cookie]
         * @DateTime 2018-09-26
         * @param    {[type]}   name  [description]
         * @param    {[type]}   value [description]
         * @param    {[type]}   time  [description]
         */
        setSrCookie: function(name, value, time) {//设置cookie方法
            var strsec = this.getsec(time); 
            var exp = new Date(); 
            exp.setTime(exp.getTime() + strsec*1); 
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
        },
        /**
         * [getSrCookie 获取cookie]
         * @DateTime 2018-09-26
         * @param    {[type]}   name [description]
         * @return   {[type]}        [description]
         */
        getSrCookie: function(name){//获取cookie方法
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg)){
                return unescape(arr[2]); 
            } else {
                return null;
            }
        },
        /**
         * [delSrCookie 删除cookie]
         * @DateTime 2018-09-26
         * @param    {[type]}   name [description]
         * @return   {[type]}       [description]
         */
        delSrCookie: function(name){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1); 
            var cval=getCookie(name); 
            if(cval!=null) 
                document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        },
        /**
         * [getsec 获取秒级时间]
         * @DateTime 2018-09-26
         * @param    {[type]}   str [description]
         * @return   {[type]}       [description]
         */
        getsec: function(str){ 
            var str1=str.substring(1,str.length)*1; 
            var str2=str.substring(0,1); 
            if (str2=="s"){ 
                return str1*1000;
            }else if (str2=="h"){ 
               return str1*60*60*1000;
            }else if (str2=="d"){ 
               return str1*24*60*60*1000;
            } 
        },
        srTrim(x) {
            return x.replace(/^\s+|\s+$/gm,'');
        }
    }
    window.SrWords = SrWords;
    
}(window, document))
