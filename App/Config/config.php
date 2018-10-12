<?php
return [
    // 基础设置::必填
    'title'             => 'SeeRuo',                    // 网站名称
    'author'            => 'Danier(左浪)',               // 您的名字
    'url'               => 'http://www.example.com',    // 网站URL
    'themes'            => 'default',                   // 网站主题

    // 本地调试设置::必填
    'server_address'    => '127.0.0.1',                 // 本地服务器调试地址
    'server_port'       => '9001',                      // 本地服务器调试地址
    'auto_open'         => true,                       // 自动打开浏览器

    // SSH发布到服务器空间::必填
    'push_type'         => 'ssh',                       // 暂时只支持ssh方式，需要服务器开启的SSH支持
    'push_user'         => 'root',                      // SSH账号
    'push_address'      => '127.0.0.1',                 // SSH推送地址
    'push_path'         => '/var/www/html/blog',        // SSH服务器网站根路径,该路径需开启写权限
    
    // ::选填
    'home_page'         => '单页/home.md',               // 是否需要使用md文件作为主页
    'single_pages'      => [                            // 单独解析的md文件，解析路径为 url/'你设置的链接'
        'about'             => '单页/about.md',          // 路径为 http://www.example.com/about
        'linker'            => '单页/linker.md'          // 路径为 http://www.example.com/linker
    ],
];