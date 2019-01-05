
基于PHP开发的静态网站构建工具-Seeruo


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
2.0使用了部分Symfony的组件，功能与之前版本一样

之前的版本仍然保留，请在composer里面声明版本即可，也可以在released里下载


#### 快速开始
```language-shell
[~]# composer create-project seeruo/seeruo myblog
[~]# cd myblog/App
[App]# php seeruo create test
[App]# php seeruo build
[App]# php seeruo server
```

更多使用细则，请参考详细使用手册。
[Github Pages](https://seeruo.github.io/)
[Seeruo官网](http://seeruo.codegrids.com/)
