<?php
return [
    // 基础设置::必填
    'title'             => 'SeeRuo',                    // 网站名称
    'author'            => 'Danier(左浪)',               // 您的名字
    'url'               => 'http://www.example.com',    // 网站URL
    'license'           => '本博客所有文章除特别声明外，转载请注明出处！',
    'themes'            => 'default',                   // 网站主题
    'page_limit'        => 5,                           // 分页条数

    // 本地调试设置::必填
    'server_address'    => '127.0.0.1',                 // 本地服务器调试地址
    'server_port'       => '9001',                      // 本地服务器调试地址
    'auto_open'         => true,                       // 自动打开浏览器

    // 发布到服务器空间 :: [云服务器] 上传必填
    // 需要服务器开启的SSH支持
    'ssh_user'          => 'root',                      // SSH账号
    'ssh_address'       => '127.0.0.1',                 // SSH推送地址
    'ssh_path'          => '/var/www/html/blog',        // SSH服务器网站根路径,该路径需开启写权限
    
    // 发布到github page :: [git] 上传必填
    // 需要github上添加"SSH keys",授权电脑免密操作
    'git_address'       => 'git@github.com:seeruo/seeruo.github.io.git',  // 仓库地址
    'git_log_file'      => 'git_log.log',

    // 单页配置 :: 选填
    // 'home_page'         => '',                          // 是否需要使用md文件作为主页 'home.md'
    // 单独解析的md文件，解析路径为 url/'你设置的链接'
    'single_pages'      => [ 
        'about'         => 'about.md',          // 路径为 http://www.example.com/about
        'linker'        => 'linker.md'          // 路径为 http://www.example.com/linker
    ],  
];