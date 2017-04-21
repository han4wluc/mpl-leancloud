'use strict';
var AV = require('leanengine');
var axios = require('axios');
var express = require('express');

var axs = axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL: process.env.MPL_HOST_PORT,
  timeout: 25000,
  // headers: {'X-Custom-Header': 'foobar'}
});

AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

var app = express();


AV.Cloud.afterSave('_User', function(request) {

  axios.post('/user', {
    _id: request.object.id,
    email: request.object.get('email'),
    username: request.object.get('username'),
  }).then(function(user){
    console.log('success', user);
  }).catch(function(error){
    console.log('error', error);
  })
});

console.log('app started')


// var app = require('./app');

// // 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// // LeanEngine 运行时会分配端口并赋值到该变量。
// var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

app.listen(PORT, function (err) {
  console.log('Node app is running on port:', PORT);

  // 注册全局未捕获异常处理器
  process.on('uncaughtException', function(err) {
    console.error("Caught exception:", err.stack);
  });
  process.on('unhandledRejection', function(reason, p) {
    console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
  });
});
