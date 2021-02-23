---
tags: [#Mac']
---
### 本文解决以下问题
<!-- toc -->

### 1. charles与shadowsocks共存
1. shadowsocks改为全局模式（PAC模式无效，必须使用全局模式）
   1. 全局模式下默认所有互联网请求全部走shadowsocks
   2. 此时如需访问内网地址
      1. 在Mac中打开 设置->网络->高级->代理，`Bypass proxy settings for these Hosts & Domains:`中填入内网IP
      2. 如图：
       ![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8ubsuvcutj30je0fcgoz.jpg)
      3. 如有多个地址，可配为134.*.*.*
2. 查看shadowsocks代理的本地http和https的端口（如上图）
   1. 一般为`127.0.0.1:1087`
3. 在Charles菜单栏找到 `proxy -> external proxy settings`
   1. 在http和https中填入127.0.0.1:1087
   2. 如图：
    ![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8ubq4cl19j30f20chwgt.jpg)
   3. 如有多个地址，可配为134.*.*.*
4. 此时即可正常抓包，如果域名为内网地址，此时会无法访问
   1. 在Charles菜单栏找到 `proxy -> external proxy settings`
   2. 在`ByPass external proxies for the following hosts：`中填入内网ip
5. 此时已完美解决Charles和shadowsocks共存问题

### 2. 转发线上页面请求到本地工程
1. Charles菜单栏 -> proxy -> MacOs Proxy
2. 右键请求列表中的url或包，选中`Map Remote...`
3. 填入对应的URL相关信息即可

### 3. 截取MacOSHttps请求
1. “Help” -> "SSL Proxying" -> "Install Charles Root Certificate"
  - 在`keychain`处将新安装的证书设置为永久信任
2. Preferences -> Proxy -> SSL Proxying Settings
  - Add -> 直接点击OK（截取所有https请求）
    ![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8u6eu1soqj30gj0cwdic.jpg)

