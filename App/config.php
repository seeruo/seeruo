<?php
return [
	'title' 			=> 'MY BLOG', 			// 网站名称
	'root' 				=> __DIR__,				// 网站根目录
    'url'       		=> '',                  // 网站URL
	'push_type'         => 'ssh',               // 暂时只支持ssh方式，需要服务器开启的SSH支持
	'push_user'         => 'root',              // SSH账号
	'push_address'      => '127.0.0.1',     	// SSH推送地址
	'push_path'         => '/var/www/html/blog',// SSH服务器网站根路径,该路径需开启写权限
    // 'home_page'         => 'home.md',           // 主页
];