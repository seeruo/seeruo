
基于PHP开发的静态网站构建工具-Seeruo

#### 版本规划
> 1.1 
* 1.0版本存在的问题优化
* 实现一些常用的博客插件的扩展钩子

> 1.0 开发基础功能，包括如下：
* 创建markdown文件，使用自己喜欢的编辑器完成文章编辑
* 使用seeruo解析markdown文件为静态文件，并设置归档，分页等功能
* 使用软件自带服务器功能，本地预览网页
* 使用ssh发布文章到生产环境(如：阿里云服务器)


#### Seeruo介绍
Seeruo是一个用php开发的用于快速构建静态博客(文档、笔记)的极简框架工具。使用markdown语法书写文章，用命令行模式构建静态文件，并上传至GitHub Pages或云服务器。

Seeruo具有如下特性：
- 简单易用
- 快速构建
- 本地预览
- 一键发布

Seeruo的开发初衷是为了用php开发一个博客系统，接触了hexo之后，吸收了hexo的一些特性，并用php开发了这套框架。
Seeruo陪备了基础框架，可以直接使用；也可以通过直接require框架的方式使用。

#### 版本说明
截止10.13日，Seeruo1.0版本基本功能开发完毕，可以暂时投入使用。


#### 快速开始
```language-shell
[~]# composer create-project seeruo/seeruo myblog
[~]# cd myblog/App
[App]# php seeruo create test
[App]# php seeruo build
[App]# php seeruo server
```

更多使用细则，请参考详细使用手册
[Github Pages](https://seeruo.github.io/)
[Seeruo官网](http://seeruo.codegrids.com/)
