---
date: 2021-02-24
tags: ["#Mac"]
---

### 本文目录

<!-- toc -->

# 0. 相关背景知识

### 0.1. Mac 中定义定时任务的几种方式

1. Launchd（官方推荐的方式）
2. cron（重启后即失效，不推荐）
3. brew services
   本文介绍使用 Launchd 方式开启定时任务

### 0.1. 什么是 Launchd

[Launchd](https://en.wikipedia.org/wiki/Launchd)是 MacOS 用来管理系统和用户级别的守护进程的工具。
该工具由两部分组成：

- launchd
  - launchd 主要有两个任务：
    - 一是启动系统
    - 二是加载和维护服务
  - 系统启动时，launchd 会加载`/System/Library/LaunchDaemons`和`/Library/LaunchDaemons`中的所有[plist 文件](#0-2-shi-me-shi-plist)，然后根据需要启动 launchctl。
- launchctl
  - 在 launchd 中，对服务的控制集中在`launchctl`中。

### 0.2. 什么是 plist

- MacOS 用来存储序列化后的对象的文件，文件后缀名为 plist，因为称为 plist 文件。
- 对于 launchd 来说，每一个 plist 文件即为一个任务（Job）
  - launchd 启动时，会扫描`/System/Library/LaunchDaemons`和`/Library/LaunchDaemons`中的所有 plist 文件并加载它们
  - 用户登录后，会扫描`/System/Library/LaunchAgents`、`/Library/LaunchAgents`、`~/Library/LaunchAgents`这三个目录的文件并加载它们
  - plist 中设置了`RunAtLoad`为`true`或`KeepAlive`为`true`时，会在加载时立即执行

plist 示例：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>KeepAlive</key>
  <true/>
  <key>Label</key>
  <string>homebrew.mxcl.mysql@5.7</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/opt/mysql@5.7/bin/mysqld_safe</string>
    <string>--datadir=/usr/local/var/mysql</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>WorkingDirectory</key>
  <string>/usr/local/var/mysql</string>
</dict>
</plist>
```

### 0.3. plist 放在不同位置时的区别

| 类型         | 位置                            | 以什么用户权限运行 | 运行时机           |
| ------------ | ------------------------------- | ------------------ | ------------------ |
| 系统 Daemons | `/System/Library/LaunchDaemons` | root/指定用户      | 开机时             |
| 全局 Daemons | `/Library/LaunchAgents`         | root/指定用户      | 开机时             |
| 系统 Agents  | `/System/Library/LaunchAgents`  | 当前登录用户       | 用户登录           |
| 全局 Agents  | `/Library/LaunchAgents`         | 当前登录用户       | 用户登录           |
| 用户 Agents  | `~/Library/LaunchAgents`        | 当前登录用户       | 当前设置用户登录时 |

`LaunchDaemons`和`LaunchAgents`主要有以下两个区别：

1. 运行时机
   1. `LaunchDaemons`在按下开机按钮后，用户还未输入密码时，就已经运行了。
   2. `LaunchAgents`在用户输入密码后，才开始运行。
2. 运行用户
   1. `LaunchDaemons`是以 root/其他指定用户运行
   2. `LaunchAgents`是以当前登录用户的权限运行

# 1. 通过 Launchctl 为 Mac 设置定时任务

下面通过实现定时开关 Mac 的 Wi-Fi 来演示具体流程：

### 1.1. 创建待执行的 shell

如果有多台 Mac 同步需求，建议将以下 shell 放入自己的 iCloud 目录，没有这个需求的话自行安排，记得存放路径就行

- closeWiFi.sh

```shell
#!/bin/sh
# 关闭Wi-Fi
networksetup -setairportpower en0 off
```

- openWiFi.sh

```shell
#!/bin/sh
# 打开Wi-Fi
networksetup -setairportpower en0 on
```

### 1.2. 创建 plist 并放入所需目录

- 这两个文件用于执行对应的需求，以下几点需要注意
  - 具体放哪个目录的参考[plist 放在不同位置时的区别](#0-3-plist-fang-zai-bu-tong-wei-zhi-shi-de-qu-bie)，我的放在`/Library/LaunchAgents`下，这样只要电脑开机，就算未输入密码，plist 文件也会被执行到
  - `Label`标签的值，不能与其他 plist 文件中的`Label`标签中的值完全重复
  - `ProgramArguments`标签中放入 shell 所在的路径
  - `StartCalendarInterval`用于控制在指定的时间执行 shell
    - 可用`StartCalendarInterval`替换为每隔 N 秒执行一次 shell
  - `RunAtLoad`和`KeepAlive`为`true`时，在 plist 被加载时，会被立即执行一次
  - `StandardOutPath`填写脚本运行日志输出的路径
  - `StandardErrorPath`填写脚本运行错误日志输出的路径
- closewifi.plist （每天晚上 23 点 00 分，执行 closeWiFi.sh）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.david.closewifi.plist</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/David/Documents/Personal/Script/closeWiFi</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Minute</key>
        <integer>00</integer>
        <key>Hour</key>
        <integer>23</integer>
    </dict>
    <key>KeepAlive</key>
    <false/>
    <key>StandardOutPath</key>
    <string>/Users/David/Documents/Personal/Script/log/closeWiFi.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/David/Documents/Personal/Script/log/closeWiFi-err.err</string>
</dict>
</plist>
```

- openwifi.plist（每天早上 09 点 00 分，执行 openWiFi.sh）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.david.openwifi.plist</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/David/Documents/Personal/Script/openWiFi</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Minute</key>
        <integer>00</integer>
        <key>Hour</key>
        <integer>09</integer>
    </dict>
    <key>KeepAlive</key>
    <false/>
    <key>StandardOutPath</key>
    <string>/Users/David/Documents/Personal/Script/log/openWiFi.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/David/Documents/Personal/Script/log/openWiFi-err.err</string>
</dict>
</plist>
```

# 2. 常用 Launchctl 命令

- `launchctl list`
  列出已加载的所有 plist
  ![](https://tva1.sinaimg.cn/large/008eGmZEgy1gnzlpmcsutj30gr0790um.jpg)
  其中 PID 为`-`的表示虽然已加载，但是未启动，PID 为数字的表示已启动并且这个数字就时它的 PID

- `launchctl load`
  `launchctl load /Library/LaunchDaemons/closewifi.plist`
  手动加载一个 plist 任务

- `launchctl unload`
  `launchctl unload /Library/LaunchDaemons/closewifi.plist`
  禁用一个 plist 任务

- `launchctl start`
  启动一个 plist 任务

- `launchctl stop`
  停止一个 plist 任务

# 更多高级用法请参考

[A launchd Tutorial](https://www.launchd.info)
[launchctl](https://ss64.com/osx/launchctl.html)
[Daemons and Services Programming Guide](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html)
[man launchd.plist](https://www.manpagez.com/man/5/launchd.plist/)
