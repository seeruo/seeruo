<?php
require_once '../vendor/autoload.php';
$config = include_once 'config.php';

$app = new \Seeruo\Application($config);
$app->run('web');
