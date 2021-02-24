---
date: 2021-02-24
tags: ['#Mac']
---

### 本文目录
<!-- toc -->

# 0. 相关背景知识
### 0.1. Mac中定义定时任务的几种方式
1. Launchd（官方推荐的方式）
2. cron（重启后即失效，不推荐）
3. brew services
### 0.1. 什么是Launchd
Launchd是MacOS用来管理系统和用户级别的守护进程的工具。
该工具由两部分组成：
- launchd
  - 开机时，launchd会加载`/System/Library/LaunchDaemons`和`/Library/LaunchDaemons`中的所有<a href="#0-2-shen-me-shi-launchd-plist">plist</a>文件，然后根据需要启动launchctl
- launchctl

[Wiki](https://en.wikipedia.org/wiki/Launchd)对launchd有如下定义：
> 
### 0.2. 什么是launchd.plist
- plist
# 1. 通过Launchctl为Mac设置定时任务

# 参考资料
https://www.xiebruce.top/983.html
https://www.launchd.info
https://ss64.com/osx/launchctl.html
https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html
https://www.manpagez.com/man/5/launchd.plist/