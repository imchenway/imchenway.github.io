---
date: 2020-01-08
lang: zh-CN
tags: ['#Tools']
---
### 本文目录
<!-- toc -->

# 源起
- 本想看一下ElasticSearch源码，结果拉取ElasticSearch源码时看到170W个文件，10kb/s的速度时。。。
- 话不多说，直接上教程，以下两种方法皆亲测有效

# 使用代理的方法
### git全局代理
```git
# socks5协议，1080端口修改成自己的本地代理端口
git config --global http.proxy socks5://127.0.0.1:1086
git config --global https.proxy socks5://127.0.0.1:1086

# http协议，1081端口修改成自己的本地代理端口
git config --global http.proxy http://127.0.0.1:1087
git config --global https.proxy https://127.0.0.1:1087
```

- 以上的配置会导致所有git命令都走代理，但是如果你混合使用了国内的git仓库，甚至是局域网内部的git仓库，这就会把原来速度快的改成更慢的了；
- 下面是仅仅针对github进行配置，让github走本地代理，其他的保持不变；

### 仅GitHub代理
```git
# socks5协议，1080端口修改成自己的本地代理端口
git config --global http.https://github.com.proxy socks5://127.0.0.1:1086
git config --global https.https://github.com.proxy socks5://127.0.0.1:1086

# http协议，1081端口修改成自己的本地代理端口
git config --global http.https://github.com.proxy https://127.0.0.1:1087
git config --global https.https://github.com.proxy https://127.0.0.1:1087
```

### 相关命令
```git
# 查看所有配置
git config -l
# reset 代理设置
git config --global --unset http.proxy
git config --global --unset https.proxy
```

# 不使用代理的方法
1. 修改host
把下面两行加到host文件末尾
```
151.101.72.249 github.http://global.ssl.fastly.net
192.30.253.112 github.com
```