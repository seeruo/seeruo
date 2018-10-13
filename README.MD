
基于PHP开发的静态网站构建工具-Seeruo

#### 版本规划
> 1.0 开发基础功能，包括如下：
* 创建markdown文件，使用自己喜欢的编辑器完成文章编辑
* 使用seeruo解析markdown文件为静态文件，并设置归档，分页等功能
* 使用软件自带服务器功能，本地预览网页
* 使用ssh发布文章到生产环境(如：阿里云服务器)

> 2.0 
* 1.0版本存在的问题优化
* 实现Git上传到github page及其他类似的静态网页展示仓库
* 实现一些常用的博客插件的扩展钩子
* 开放平台，实现软件的注册使用

#### 准备开始
> 开始安装，使用之前有些条件需要满足，当然phper应该都已经有这些了：
- 安装php，并设置环境变量: 下载地址
- 安装Composer工具: 下载地址

#### 安装seeruo
```language-shell
composer create-project seeruo/seeruo myblog
```

#### 开始使用
> 1.创建文件
```language-shell
php seeruo create 'filename' //不需要加文件后缀
```
文件创建完成之后在App/Source可以查看，你可以选择你自己喜欢的编辑器去撰写文章

> 2.开启服务（两种方式: start-实时构建静态文件, build-用于单次构建静态文件）
```language-shell
php seeruo start
php seeruo build
```
生成的静态文件存放在App/_Public里面,(_Public可以在配置文件里面自定义)


> 3.本地调试
```language-shell
php seeruo server
```

> 4.发布到生产环境
```language-shell
php seeruo push
```
注意：如果需要发布到生产环境，这里需要到Config/config.php里面去配置配置文件，配置项如下:
```language-php
'push_type'         => 'ssh',               // 暂时只支持ssh方式，需要服务器开启的SSH支持
'push_user'         => 'root',              // SSH账号
'push_address'      => '127.0.0.1',         // SSH推送地址
'push_path'         => '/var/www/html/blog',// SSH服务器网站根路径,该路径需开启写权限
```

