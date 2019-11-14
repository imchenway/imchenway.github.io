---
title: 使用GitHub + Hexo搭建个人博客
date: 2019-11-12 18:33:09
tags: ['#GitHub','#Hexo']
---

### 本文目录
<!-- toc -->

# 1. 准备环境
- `node.js`
- `git`
- `npm`

# 2. 安装Hexo

### 2.1. 执行以下命令安装Hexo
```
npm install -g hexo-cli
```

### 2.2. 初始化
```
hexo init imchenway.com
cd imchenway.com
npm install
```

### 2.3. 初始化后的目录为
```
.
├── _config.yml # 网站的配置信息，您可以在此配置大部分的参数。 
├── package.json
├── scaffolds # 模版文件夹
├── source  # 资源文件夹，除 _posts 文件，其他以下划线_开头的文件或者文件夹不会被编译打包到public文件夹
|   ├── _drafts # 草稿文件
|   └── _posts # 文章Markdowm文件 
└── themes  # 主题文件夹
```

### 2.4. 执行以下命令查看效果,s 是`server`的缩写，浏览器输入[http://localhost:4000](http://localhost:4000)就可以预览效果了。
```
hexo s
```

# 3. 创建GitHub Pages

### 3.1. 创建[repository](https://github.com/new)
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8vgepn3x9j30tw0mjdme.jpg)

### 3.2. Clone the repository
```
git clone https://github.com/imchenway/imchenway.github.io.git
```

### 3.3. Hello World
```
cd username.github.io

echo "Hello World" > index.html
```

### 3.4. Push it
```
git add --all

git commit -m "Initial commit"

git push -u origin master
```

### 3.5. Settings配置
- source中选中自己的master分支
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8vgjj4p8fj30rq0423zz.jpg)
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8vgks8f4yj30pq0gsdlp.jpg)

### 3.6. 此时访问<https://imchenway.github.io/>即可看到效果

# 4. 将Hexo部署到Github

### 4.1 配置SSH key

##### 4.1.1. 测试SSH key
- 命令行输入`cd ~/.ssh`
- 如果没报错或者提示什么的说明就是以前生成过的，直接使用`cat ~/.ssh/id_rsa.pub`命令查看本机上的`SSH key`

##### 4.1.2. 如果之前没有创建，则执行以下命令全局配置一下本地账户：
```
git config --global user.name "用户名"
git config --global user.email "邮箱地址"
```
##### 4.1.3. 然后开始生成密钥 SSH key
```
ssh-keygen -t rsa -C '上面的邮箱'
```
- 按照提示完成三次回车，即可生成`ssh key`。
- 通过`cat ~/.ssh/id_rsa.pub`查看 `~/.ssh/id_rsa.pub` 文件内容，获取到你的`SSH key`

##### 4.1.4. 首次使用还需要确认并添加主机到本机SSH可信列表
- 若返回 Hi xxx! You've successfully authenticated, but GitHub does not provide  access. 内容，则证明添加成功。
```
ssh -T git@github.com
```

##### 4.1.5. Github 上添加刚刚生成的SSH key，按以下步骤添加：
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8vgvddczmj31ac0f6qca.jpg)

### 4.2 Hexo部署到GitHub

##### 4.2.1. 进入Hexo初始化的目录`imchenway.com`下,修改`_config.yml`中的deploy配置
```
cd imchenway.com
vi _config.yml
```
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8vgzn6lidj30gu044q4a.jpg)

##### 4.2.2. 安装部署插件
```
npm install hexo-deployer-git --save
```

##### 4.2.3. 执行部署命令,g = generate,d = deploy
```
hexo g -d
```

##### 4.2.4. 访问<https://imchenway.github.io/>查看效果

# 5. 发表博文
### 5.1. 创建新的博文
```
hexo new '博文标题'
```

### 5.2. 本地测试
```
hexo g
hexo s
```

### 5.3. 重新部署到GitHub,访问<https://imchenway.github.io/>查看效果
```
hexo clean
hexo g -d
```

# 6. 更换主题
### 6.1. 终端执行
```
cd imchenway.com
cd themes
git clone https://github.com/Ben02/hexo-theme-Anatole.git anatole
cd anatole
git pull
npm install --save hexo-render-pug hexo-generator-archive hexo-generator-tag hexo-generator-index hexo-generator-category
```


### 6.2.修改`_config.yml`
```
# anatole
archive_generator:
    per_page: 0  
    yearly: false
    monthly: false
    daily: false
```
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8virr42naj30pm0bkq7f.jpg)

### 6.3. 重新部署到GitHub,访问<https://imchenway.github.io/>查看效果
```
hexo clean
hexo g -d
```

# 7. hexo备份

### 7.1 安装备份插件
- 终端执行
```
npm install hexo-git-backup --save
```
- 修改根目录`_config.yml`，添加如下内容
```
# theme：你要备份的主题名称
# message：自定义提交信息
# repository：仓库名，仓库地址添加一个分支名
backup:
  type: git
  theme: anatole
  message: Back up my imchenway.com blog
  repository:
    github: https://github.com/imchenway/imchenway.github.io.git,hexo
```
- 在原GitHub.io项目下创建分支`hexo`
- 终端执行
```
hexo backup
git push
```

### 7.2 恢复博客
```
git clone https://github.com/imchenway/imchenway.github.io.git
npm install hexo-cli
npm install
npm install hexo-deployer-git --save
```

# 开启TOC支持
- 安装插件
```
npm install hexo-toc --save
```
- 修改`_config.yml`
```
toc:
  maxdepth: 3
  class: toc
  slugify: transliteration
  decodeEntities: false
  anchor:
    position: after
    symbol: '#'
    style: header-anchor
```
- 文章中加入
```
<!-- toc -->
```

# 文章标题区分大小写
- 将主题文件夹`/source/css/`目录中的`.scss`文件里面的`text-transform: uppercase;`全去掉