const express = require('express');
const http = require('http');
const app = express();
const {network} = require('./config/index');

// 允许跨域
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  // res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("X-Powered-By", ' 3.2.1')
  if (req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
  else next();
});
app.use('/public', express.static('public'));

// 嵌入一个接口处理格式转化
const workerHandler = require('./routers/workerHandler');
app.use('/workerHandler', workerHandler);

const  {jwtAuth} = require("./commonFunc/jwt"); // 引入jwt token认证
app.use(jwtAuth);
const tokens = require('./routers/tokens');
const model = require('./routers/model');

app.use('/tokens', tokens);
app.use('/model', model);

http.createServer(app).listen(network.port)