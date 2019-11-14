---
tags: ['#Mac']
---

### 本文目录
<!-- toc -->

# 1. 准备工具
- 1.PlistEdit Pro
- 2.RDM
- 3.16进制和10进制转换工具


# 2. 关闭System Integrity Protection SIP
- 我们重启macbook，在开机的时候按command+R进入恢复模式，然后我们在终端输入

- `csrutil disable`

当我们设置完分辨率后可以再输入以下命令打开，保证安全性。

- `csrutil enable`

# 3. 开启macbook的hidpi
- 打开终端输入

`sudo defaults write /Library/Preferences/com.apple.windowserver DisplayResolutionEnabled -bool YES`
- 回车后，需要输入管理员密码，然后再回车，完毕。

# 4. 获取2k显示器的DisplayVendorID和DisplayProductID
- 我们先不插外界显示器的连接线，获取macbook自己屏幕的ID，然后再插上外接显示器获取外界显示器的ID。
在终端输入如下命令

`ioreg -l | grep "DisplayVendorID"`

`ioreg -l | grep "DisplayProductID"`

如图：
![](http://ww1.sinaimg.cn/large/7c2d7f0egy1ftvh2a3ui9j20yi0ne7a5.jpg)

- 我经过显示器的拔插就可以筛选出外接显示器的两个ID。DisplayVendorID为2513，DisplayProductID为32795
- 我们新建一个名字为DisplayVendorID-XXXX的文件夹，其中XXXX是DisplayVendorID的16进制小写即9d1，则文件夹名字为DisplayVendorID-9d1。然后再创建一个空白文件，这里你们可以直接用我的模板进行修改.[点我下载](https://www.ianisme.com/download/201803/DisplayVendorID-9d1.zip)
- 我们将这个文件命名为DisplayProductID-YYYY，其中YYYY即DisplayProductID的16进制小写即801b。

# 5. 编辑DisplayProductID-YYYY文件
- 我们使用PlistEdit Pro去打开这个文件，然后在DisplayProductID和DisplayVendorID处填写这两个值的10进制原始值，然后下面按照如下规则去设置对应的分辨率。
- 例如我这里要设置 1920 * 1080 hidpi 的设置，我设置 1920 * 1080 和 3840 * 2160 两种。
1920的16进制是00000780，1080的16进制是00000438，后面需要拼接上00000001 00200000
- 即：
00000780 00000438 00000001 00200000
3840的16进制是00000F00，2160的16进制是00000870，后面需要拼接上00000001 00200000
00000F00 00000870 00000001 00200000
- 我们将这个数据添加到文件中去。

文件中添加了几个例子。
如图：
![](http://ww1.sinaimg.cn/large/7c2d7f0egy1ftvh44en6oj211k0za17j.jpg)

然后我们把这个文件夹拷贝到/System/Library/Displays/Contents/Resources/Overrides/中去

# 6. 使用RDM进行切换
重启系统打开RDM，这就可以进行切换了。
如图：
![](http://ww1.sinaimg.cn/large/7c2d7f0egy1ftvh4xp761j20d409wad7.jpg)

# 7."Read-only file system"
- 解決方法
`sudo mount -uw /`