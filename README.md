# Fileman client

[![build status](https://img.shields.io/travis/big-wheel/fileman-client/master.svg?style=flat-square)](https://travis-ci.org/big-wheel/fileman-client)
[![Test coverage](https://img.shields.io/codecov/c/github/big-wheel/fileman-client.svg?style=flat-square)](https://codecov.io/github/big-wheel/fileman-client?branch=master)
[![NPM version](https://img.shields.io/npm/v/fileman-client.svg?style=flat-square)](https://www.npmjs.com/package/fileman-client)
[![NPM Downloads](https://img.shields.io/npm/dm/fileman-client.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/fileman-client)

## 开发了 fm push-img (doc 待续)

```bash
npm i -g fileman-client
```

> 一个迷你封装 from 一个小轮子 [express-restful-fileman](https://github.com/imcuttle/express-restful-fileman)，用于方便管理静态的 sdk。
静态服务推荐使用另外一个小轮子 [github-similar-server](https://github.com/imcuttle/github-similar-server)

## 如何使用
### 初始化
```javascript
import * as fileman from 'fileman-sdk'
// token: 验证信息, ak,sk 有的话也在这初始化
// config: 一些乱七八糟别的配置，万一有什么拓展呢（上传自动重试次数，限制上传类型..
var client = new fileman(token, config);
```

### 上传
```javascript
// file: Blob 对象，上传的文件(blob 对象 || <file path > node 环境 || dataurl ...)
// key: 文件资源名
// config （针对某特定资源的乱七八糟的配置？）
client.uploadFile(file, key, config);

/* 一些监听 */
var observer = {
  next(res){ //  提供上传进度信息
    // res.loaded(已上传大小)
    // res.total(本次上传的总量控制信息,注意这里的 total 跟文件大小并不一致)
    // res.percent(当前上传进度 0-100)
  },
  error(err){ // 上传错误后触发,xhr 请求错误,JSON 解析异常等,isRequestError,reqId,code,message
  }, 
  complete(res){ // ...
  }
}
// 开始上传
var subscription = observable.subscribe(observer)

// 取消上传
subscription.unsubscribe()
```

### 查询
```javascript
client.listFiles(bucketName)
  .then(function (response) {
      var contents = response.body.contents;
      for (var i = 0, l = contents.length; i < l; i++) {
          console.log(contents[i].key);
      }
  })
  .catch(function (error) {
      // 查询失败
  });
```

### 下载

```javascript
// 暂时不支持断点吧，下载就整个下载了
client.getFile(BucketName, Key)
    .then(function(response) {
        let buffer = response.body;
    });
```

### 删除
```javascript
client.deleteFile(BucketName, Key)
```


## FEATURE
