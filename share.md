# postcss


## pre-processor（预处理器）

在写CSS的时候，经常会碰到这样的问题，比如说“变量”:
```
h1{
    color:red;
}
.title{
    color:red;
}
.classA{
    color:red;
}
```
如果有一天，我想要把颜色改用蓝色怎么办？你需要：查找 -> red ->替换 -> blue 。还有更多的问题，比如代码复用，嵌套，Mixins（混入）等等…

于是 Sass / Less就出现了，他们都是 CSS 的预处理器
```
$font-stack: Helvetica, sans-serif;
$primary-color: #333;
 
body {
  font: 100% $font-stack;
  color: $primary-color;
}
```
## post-processor（后处理器）

在写 CSS 的时候，会针对浏览器加上一些前缀，但是每次都这样写实在是很麻烦，如：
```
.my-class, #my-id {
    border-radius: 1em;
    transition: all 1s ease;
    box-shadow: #333 0 0 10px;
}
```
经过 post-processor (如 prefixer) 处理后
```
.my-class, #my-id {
    -moz-border-radius: 1em;
    -webkit-border-radius: 1em;
    border-radius: 1em;
    -moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    -webkit-transition: all 1s ease;
    transition: all 1s ease;
    -moz-box-shadow: #333 0 0 10px;
    -webkit-box-shadow: #333 0 0 10px;
    box-shadow: #333 0 0 10px
}
```

## 什么是 [PostCSS](https://github.com/postcss/postcss, "PostCSS") ？

官方定义：
>PostCSS is a tool for transforming styles with JS plugins. These plugins can lint your CSS, support variables and mixins, transpile future CSS syntax, inline images, and more.

PostCSS 提供了一个解析器，它能够将 CSS 解析成AST抽象语法树。然后我们能写各种插件，对抽象语法树做处理 (增加，删除，修改)，最终生成新的css文件，以达到对css进行精确修改的目的。


![PostCSS原理图](https://pic4.zhimg.com/80/v2-32fb96e83b2c1cc4f4ae85f730243de3_hd.jpg "PostCSS")

- 如何开发一个PostCSS插件？

PostCSS官方提供插件编写的模板，只需要将其下载下来：
```
git clone https://github.com/postcss/postcss-plugin-boilerplate.git
````

index.js默认的内容是这样的：
```
var postcss = require('postcss');

module.exports = postcss.plugin('postcss-practice', function (opts) {
    opts = opts || {};

    // Work with options here

    return function (root, result) {

        // Transform CSS AST here

    };
});
```
假设我们检测到某个样式中有"color: red"这样一条样式规则，需要自动增加"background-color: red"这样一条规则。

那么index.js:
```
var postcss = require('postcss')

module.exports = postcss.plugin('PLUGIN_NAME', function (opts) {
  opts = opts || {}
  console.log('options', opts);
  // Work with options here

  return function (root, result) {
    console.log('root', root);
    console.log('result', result)
    // Transform CSS AST here
    root.walkRules(rule => {
      console.log(rule.selector);
      rule.walkDecls(decl => {
          if (
              decl.prop === 'color' &&
              decl.value === 'red'
          ) {
              rule.append({
                  prop: 'background-color',
                  value: 'red'
              });
          }
      });
    });
  }
})

```

root.walkRules会遍历每一个CSS规则，可以通过rule.selector拿到每一组规则中的选择器，然后通过rule.walkDecls遍历每一组规则中的样式声明， 通过decl.prop，decl.value拿到样式声明中的属性和值。上面判断属性是否为'background-color'、值是否为'red'，如果满足条件则向规则中插入一条新的样式声明(这里为了简单，没有考虑是否已经存在background-color声明)。
