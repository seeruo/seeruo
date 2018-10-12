
基于PHP开发的静态网站构建工具-Seeruo

#### 版本开发计划
> 1.0 稳定基础功能
* 创建文件，完成文章编辑
* Markdown文件解析
* 本地预览文件
* 文章发布到生产环境(如：阿里云服务器)

> 2.0 （1.0版本存在的问题优化）
* 创建的中文文件，实现中文URL解析，及本地中文URL预览
* 实现Git上传到github page及其他类似的静态网页展示仓库
* 实现FTP上传虚拟空间的上传

#### 安装seeruo
```language-shell
composer create-project seeruo/seeruo myblog
```

#### 快速开始
> 开始使用之前要求：
* PHP的环境变量已经配置
* 进入'myblog/App'目录

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
注意：这里需要到seeruo里面去配置配置文件，配置内容如下
```language-php
'push_type'         => 'ssh',               // 暂时只支持ssh方式，需要服务器开启的SSH支持
'push_user'         => 'root',              // SSH账号
'push_address'      => '127.0.0.1',         // SSH推送地址
'push_path'         => '/var/www/html/blog',// SSH服务器网站根路径,该路径需开启写权限
```

