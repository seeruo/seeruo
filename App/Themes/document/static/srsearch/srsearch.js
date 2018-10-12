;(function (window, document) {
    var SrSearch = function (target, options) {
        // 检查是否是本对象
        if(!(this instanceof SrSearch)){
            return new SrSearch(target, options);
        }

        // 参数合并
        this.options = this.extend({
            apiBase:"http://127.0.0.1:9001/articles"
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
    SrSearch.prototype = {
        /**
         * [init 初始化插件]
         * @DateTime 2018-09-26
         * @return   {[type]}   [description]
         */
        dataSource:{}, // 数据源
        dataResult:{}, // 数据源
        init: function () {
            this.renderDialog();
        },
        /**
         * [renderDialog 渲染对话框]
         * @DateTime 2018-09-26
         * @return   {[type]}   [description]
         */
        renderDialog() {
            var ss = this.target;
            var dialog = document.createElement("div");
            dialog.classList.add("srsearch-dialog");

            var dlg_html = '<div class="srsearch-dialog-mask"></div>';
            dlg_html += '<div class="srsearch-dialog-module">';
            dlg_html += '<div class="srsearch-dialog-close">X</div>';
            dlg_html += '<div class="srsearch-dialog-body">';
            dlg_html += '<div class="srsearch-dialog-input"><input class="srsearch-input" placeholder="搜索"></div>';
            dlg_html += '<div class="srsearch-dialog-scroll"><div class="srsearch-dialog-main"></div></div>';
            dlg_html += '</div>';
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

            // 打开对话框
            this.target.addEventListener("click",function(){
                // 打开对话框
                _this.showDialog();
                // 获取数据源
                _this.ajax('get', _this.options.apiBase+'/data.json', {}, function (res) {
                    _this.dataSource = res;
                }, true)
            }, false);

            // 关闭对话框
            var closeBtnDom = this.target.querySelector('.srsearch-dialog-close');
            closeBtnDom.addEventListener("click",function(){
                _this.closeDialog()
                window.event? window.event.cancelBubble = true : e.stopPropagation();
            }, false);

            // 关闭对话框
            var searchBtnDom = this.target.querySelector('.srsearch-dialog .srsearch-input');
            searchBtnDom.addEventListener("input",function(){
                _this.handleSearch(this.value);
            }, false);
        },
        closeDialog(){
            var dialog = this.target.querySelector('.srsearch-dialog');
            dialog.classList.remove("srsearch-dialog-show");
        },
        showDialog(){
            var dialog = this.target.querySelector('.srsearch-dialog');
            dialog.classList.add("srsearch-dialog-show");
        },
        handleSearch(input){
            var result = [];
            if (input !== ''){
                input = input.toLowerCase();
                this.dataSource.forEach(function(item){
                    var find = false;
                    for(v in item){
                        var pos = item[v].toLowerCase().indexOf(input);
                        if (pos !== -1) {
                            find = true;
                        }
                    }
                    if (find) {
                        result.push(item);
                    }
                });
            }
            this.dataResult = result;
            this.renderList(input);
        },
        renderList(input){
            var html = '';
            var _this = this;
            this.dataResult.forEach(function(item){
                var title = _this.highLight(item.title, input);
                html+= '<blockquote class="archives-one "><h2><a href="'+item.href+'">'+title+'</a>';
                html+= '<span class="fa fa-clock-o"> '+item.date+' </span></h2>';
                var tags = _this.highLight(item.tags, input);
                html+= '<div><i class="fa fa-bookmark">'+tags+'</i>';
                var type = _this.highLight(item.type, input);
                html+= '&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-book">'+type+'</i></div></blockquote>';
            });

            var showArea = this.target.querySelector('.srsearch-dialog-main');
            showArea.innerHTML = html;
        },
        /**
         * [highLight 高亮显示结果]
         * @DateTime 2018-10-11
         * @param    {[type]}   html  [description]
         * @param    {[type]}   input [description]
         * @return   {[type]}         [description]
         */
        highLight(html, input){
            var pos = html.toLowerCase().indexOf(input);
            if (pos !== -1) {
                var len = input.length;
                var f = html.slice(0, pos);
                var s = html.slice(pos, pos+len);
                var l = html.slice(pos+len, html.length);
                l = this.highLight(l);
                html = f + '<strong style="color:red">'+s+'</strong>'+l;
            }
            return html;
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
            // 异步请求状态发生改变时会执行这个函数
            xhr.onreadystatechange = function () {
                // status == 200 用来判断当前HTTP请求完成
                if ( xhr.readyState == 4 && xhr.status == 200 ) {
                    callback(JSON.parse(xhr.responseText))  // 执行回调
                }
            }
            data_str = data_str ? data_str : null;
            xhr.send( data_str )
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
    window.SrSearch = SrSearch;
    
}(window, document))
