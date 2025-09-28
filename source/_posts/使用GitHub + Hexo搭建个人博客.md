---
date: 2019-10-24
tags: ['#Tools']
---

### 本文目录
<!-- toc -->

# 1. 准备环境
- `node.js`
- `git`
- `npm`

# 2. 安装Hexo

#### 2.1. 执行以下命令安装Hexo
```
npm install -g hexo-cli
```

#### 2.2. 初始化
```
hexo init imchenway.com
cd imchenway.com
npm install
```

#### 2.3. 初始化后的目录为
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

#### 2.4. 执行以下命令查看效果,s 是`server`的缩写，浏览器输入[http://localhost:4000](http://localhost:4000)就可以预览效果了。
```
hexo s
```

# 3. 创建GitHub Pages

#### 3.1. 创建[repository](https://github.com/new)
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8vgepn3x9j30tw0mjdme.jpg)

#### 3.2. Clone the repository
```
git clone https://github.com/imchenway/imchenway.github.io.git
```

#### 3.3. Hello World
```
cd username.github.io

echo "Hello World" > index.html
```

#### 3.4. Push it
```
git add --all

git commit -m "Initial commit"

git push -u origin master
```

#### 3.5. Settings配置
- source中选中自己的master分支
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8vgjj4p8fj30rq0423zz.jpg)
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8vgks8f4yj30pq0gsdlp.jpg)

#### 3.6. 此时访问<https://imchenway.github.io/>即可看到效果

# 4. 将Hexo部署到Github

#### 4.1 配置SSH key

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

#### 4.2 Hexo部署到GitHub

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

##### 4.2.3. 推送源码触发 Actions 自动部署
```
git add .
git commit -m "chore: sync local changes"
git push origin hexo
```

##### 4.2.4. 访问<https://imchenway.github.io/>查看效果

# 5. 发表博文
#### 5.1. 创建新的博文
```
hexo new '博文标题'
```

#### 5.2. 本地测试
```
hexo g
hexo s
```

#### 5.3. 重新部署到GitHub,访问<https://imchenway.github.io/>查看效果
```
hexo clean
hexo g -d
```

# 6. 更换主题
#### 6.1. 终端执行
```
cd imchenway.com
cd themes
git clone https://github.com/Ben02/hexo-theme-Anatole.git anatole
cd anatole
git pull
npm install --save hexo-render-pug hexo-generator-archive hexo-generator-tag hexo-generator-index hexo-generator-category
```


#### 6.2.修改`_config.yml`
```
# anatole
archive_generator:
    per_page: 0  
    yearly: false
    monthly: false
    daily: false
```
![](https://tva1.sinaimg.cn/large/006y8mN6gy1g8virr42naj30pm0bkq7f.jpg)

#### 6.3. 重新部署到GitHub,访问<https://imchenway.github.io/>查看效果
```
hexo clean
hexo g -d
```

# 7. hexo备份

#### 7.1 安装备份插件
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

#### 7.2 恢复博客
```
git clone https://github.com/imchenway/imchenway.github.io.git
npm install hexo-cli
npm install
npm install hexo-deployer-git --save
```

# 8. 开启TOC支持
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

# 9. 文章标题区分大小写
- 将主题文件夹`/source/css/`目录中的`.scss`文件里面的`text-transform: uppercase;`全去掉

# 10. 集成Gitalk
- 打开`hexo/themes/anatole/layout/partial/comments.pug`文件, 在文件末尾加入以下代码:
```pug
if theme.gitalk
    if theme.gitalk.enable == true
        link(rel="stylesheet", href='https://unpkg.com/gitalk/dist/gitalk.css')
        div(id='gitalk-container')
        script(src="/js/md5.min.js")
        script(src='https://unpkg.com/gitalk/dist/gitalk.min.js')
        script.
            var gitalk = new Gitalk({
                clientID: '#{theme.gitalk.clientID}',
                clientSecret: '#{theme.gitalk.clientSecret}',
                id: md5(location.pathname),
                repo: '#{theme.gitalk.repo}',
                owner: '#{theme.gitalk.owner}',
             admin: '#{theme.gitalk.admin}'
            })
            gitalk.render('gitalk-container');
```
- 在 `/hexo/themes/anatole/source/js` 目录中新建文件 `md5.min.js` , 在其中加入如下内容:
```js
md5.min.js!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}"function"==typeof define&&define.amd?define(function(){return A}):"object"==typeof module&&module.exports?module.exports=A:n.md5=A}(this);
//# sourceMappingURL=md5.min.js.map
```

- 在 `hexo/_config.yml`中增加以下内容:
```yaml
#gitalk settings
plugins:
  gitalk:
    enable: true
    owner: imchenway
    repo: imchenway.github.io
    admin: imchenway
    clientID: your clientID
    clientSecret: your clientSecret
    distractionFreeMode: false
```

# 10. 集成百度统计
- 1. [注册百度统计](https://tongji.baidu.com/web/10000111788/welcome/login)
- 2. 添加你的博客地址
- 3. 在`hexo\themes\anatole\layout\partial` 目录下打开`head.pug`, 在末尾加上以下内容:
```pug
script.
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?542ea8c4a9ce535736e775029b1fad26";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    })();
```
- 4. 等待20分钟后点击代码检查，显示代码安装正确即可
![](https://tva1.sinaimg.cn/large/006tNbRwly1g9ju6jbbdpj30uu0bkdh3.jpg)

# 11. 集成Google Adsense
