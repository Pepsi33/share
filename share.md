## 一、什么是 [PostCSS](https://github.com/postcss/postcss, "PostCSS") ？

官方定义：
>PostCSS is a tool for transforming styles with JS plugins. These plugins can lint your CSS, support variables and mixins, transpile future CSS syntax, inline images, and more.

PostCSS 提供了一个解析器，它能够将 CSS 解析成AST抽象语法树。然后我们能写各种插件，对抽象语法树做处理 (增加，删除，修改)，最终生成新的css文件，以达到对css进行精确修改的目的。




## 二、 它本质上是什么东西？
- PostCSS 可以直观的理解为：它就是一个平台、平台、平台
> 为什么说它是一个平台呢？因为我们直接用它，感觉不能干什么事情，但是如果让一些插件在它上面跑，那么将会很强大。
- postCSS 提供了一个解析器，它能够将 CSS 解析成抽象语法树（AST）


我们可以理解为下面这个模型

![PostCSS原理图](https://pic4.zhimg.com/80/v2-32fb96e83b2c1cc4f4ae85f730243de3_hd.jpg "PostCSS")

所以说，PostCSS 它需要一个插件系统才能够发挥作用。我们可以通过“插件”来传递AST，然后再把AST转换成一个串，最后再输出到目标文件中去。





## 三、 它能解决什么问题？通过什么方式解决问题？

- 它能够为 CSS 提供额外的功能
- 通过在 PostCSS 这个平台上，我们能够开发一些插件，来处理我们的CSS，比如热门的：autoprefixer
- 我们能够使用JavaScript来开发插件（这点对前端来说很重要）

用 autoprefixer 举个🌰
```
// postcss 的命令行工具
npm install  -g postcss-cli
// autoprefixer 插件
npm install -g autoprefixer
```
```
// 1. 先看下这个命令有哪些参数可以用
➜  postCSS git:(master) ✗ postcss -h

                                      /|\
                                    //   //
                                  //       //
                                //___*___*___//
                              //--*---------*--//
                            /|| *             * ||/
                          // ||*               *|| //
                        //   || *             * ||   //
                      //_____||___*_________*___||_____//

Usage:
  postcss [input.css] [OPTIONS] [-o|--output output.css] [--watch|-w]
  postcss <input.css>... [OPTIONS] --dir <output-directory> [--watch|-w]
  postcss <input-directory> [OPTIONS] --dir <output-directory> [--watch|-w]
  postcss <input-glob-pattern> [OPTIONS] --dir <output-directory> [--watch|-w]
  postcss <input.css>... [OPTIONS] --replace

Basic options:
  -o, --output   Output file                                            [字符串]
  -d, --dir      Output directory                                       [字符串]
  -r, --replace  Replace (overwrite) the input file                       [布尔]
  --map, -m      Create an external sourcemap
  --no-map       Disable the default inline sourcemaps
  --verbose      Be verbose                                               [布尔]
  --watch, -w    Watch files for changes and recompile as needed          [布尔]
  --env          A shortcut for setting NODE_ENV                        [字符串]

Options for when not using a config file:
  -u, --use      List of postcss plugins to use                           [数组]
  --parser       Custom postcss parser                                  [字符串]
  --stringifier  Custom postcss stringifier                             [字符串]
  --syntax       Custom postcss syntax                                  [字符串]

Advanced options:
  --ext     Override the output file extension; for use with --dir      [字符串]
  --base    Mirror the directory structure relative to this path in the output
            directory, for use with --dir                               [字符串]
  --poll    Use polling for file watching. Can optionally pass polling interval;
            default 100 ms
  --config  Set a custom directory to look for a config file            [字符串]

选项：
  --version   显示版本号                                                  [布尔]
  -h, --help  显示帮助信息                                                [布尔]

示例：
  postcss input.css -o output.css           Basic usage
  postcss src/**/*.css --base src --dir     Glob Pattern & output
  build
  cat input.css | postcss -u autoprefixer   Piping input & output
  > output.css

If no input files are passed, it reads from stdin. If neither -o, --dir, or
--replace is passed, it writes to stdout.

If there are multiple input files, the --dir or --replace option must be passed.

Input files may contain globs (e.g. src/**/*.css). If you pass an input
directory, it will process all files in the directory and any subdirectories,
respecting the glob pattern.
```

```
// 出现问题
postcss src/index.css -u autoprefixer -o main.css

// 转换后没变
* {
    transition: all .1s;
    display: flex;
}
```

node 去执行文件的方式
```
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var fs = require('fs');

var css = '* { transition: all .1s; }';

postcss([autoprefixer])
    .process(css)
    .then(function(result) {
        // 这一行是学习的时候需要的，看一下到底对象里面包含什么
        console.log(result);
        if (result.css) {
            fs.writeFileSync('index.css', result.css);
        }
        if (result.map) {
            fs.writeFileSync('index.css.map', result.map);
        }
    });

    // 执行
    node test.js

    // 执行结果
    Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.
Result {
  processor: Processor { version: '7.0.7', plugins: [ [Object] ] },
  messages: [],
  root:
   Root {
     raws: { semicolon: false, after: '' },
     type: 'root',
     nodes: [ [Object] ],
     source: { input: [Object], start: [Object] },
     lastEach: 11,
     indexes: {},
     _autoprefixerDisabled: false,
     _autoprefixerGridStatus: false },
  opts: {},
  css: '* { transition: all .1s; }',
  map: undefined,
  lastPlugin:
   { [Function: plugin]
     options: { grid: false },
     browsers: undefined,
     info: [Function],
     postcssPlugin: 'autoprefixer',
     postcssVersion: '7.0.7' } }
```


## 四、 有何优势？

比如，我们用 SASS 来处理 box-shadow 的前缀，我们需要这样写：
```
/* CSS3 box-shadow */
@mixin box-shadow($top, $left, $blur, $size, $color, $inset: false) {
    @if $inset {
        -webkit-box-shadow: inset $top $left $blur $size $color;
        box-shadow: inset $top $left $blur $size $color;
    } @else {
        -webkit-box-shadow: $top $left $blur $size $color;
        box-shadow: $top $left $blur $size $color;
    }
}
```

使用 PostCSS 我们只需要按标准的 CSS 来写就行了，因为最后 autoprefixer 会帮我们做添加这个事情
```
box-shadow: 0 0 3px 5px rgba(222, 222, 222, .3);
```
实际上，PostCSS 改变的是一种开发模式。

- SASS等工具：源代码 -> 生产环境 CSS
- PostCSS：源代码 -> 标准 CSS -> 生产环境 CSS

目前是 SASS/LESS + PostCSS 这样的开发模式，取长补短。当然，在 PostCSS 平台上都是可以做到的<插件机制>，只是目前这个过渡期，这样更好，更工程化。

## 五、 它由哪些东西组成

其实从官方介绍来看，只包含以下内容：
- CSS Parser
- CSS 节点树 API
- source map 生成器
- 生成节点树串

其中的I/O体现在:
- Input: 插件程式和CSS Parser
- Output: 生成节点树串

CSS Parser 可以理解为一个内部过程，而插件程式主要体现在：
```
postcss([ autoprefixer ])
```

最后生成的节点树串体现在：
```
postcss().process().then(function (result) {
    // 就是这里了
    console.log(result.css);
});

// 执行test-opt.js
Result {
  processor: Processor { version: '7.0.7', plugins: [ [Object], [Object] ] },
  messages: [],
  root:
   Root {
     raws: { semicolon: false, after: '' },
     type: 'root',
     nodes: [ [Object] ],
     source: { input: [Object], start: [Object] },
     lastEach: 38,
     indexes: {},
     _autoprefixerDisabled: false,
     _autoprefixerGridStatus: false,
     rawCache:
      { colon: ':',
        indent: '',
        beforeDecl: '',
        beforeRule: '',
        beforeOpen: '',
        beforeClose: '',
        beforeComment: '',
        after: '',
        emptyBody: '',
        commentLeft: '',
        commentRight: '' } },
  opts:
   { from: 'src/index.css',
     to: 'dist/index-opts.css',
     map: { inline: false } },
  css: '*{transition:all .1s;display:flex}\n/*# sourceMappingURL=index-opts.css.map */',
  map:
   SourceMapGenerator {
     _file: 'index-opts.css',
     _sourceRoot: null,
     _skipValidation: false,
     _sources: ArraySet { _array: [Array], _set: [Object] },
     _names: ArraySet { _array: [], _set: Map {} },
     _mappings: MappingList { _array: [Array], _sorted: true, _last: [Object] },
     _sourcesContents:
      { '../src/index.css': '* {\n    transition: all .1s;\n    display: flex;\n}' } },
  lastPlugin: { [Function] postcssPlugin: 'cssnano', postcssVersion: '7.0.7' } }
```

## 六、 如何开发一个PostCSS插件？

- PostCss会帮我们分析出css的抽象语法树，要想写插件去处理css，需要先了解一下它透出的css ast。

    <b>1. 类型</b>

    - AtRule: @xxx的这种类型，如@screen
    - Comment: 注释
    - Rule: 普通的css规则

    还有几个个比较重要的子类型：

    - decl： 指的是每条具体的css规则
    - rule：作用于某个选择器上的css规则集合

    [可以去这里看看ast语法树结构-举个🌰]('https://astexplorer.net/#/2uBU1BLuJ1')
    
    <b>一个ast节点基本有如下信息：</b>
     - nodes: css规则的节点信息集合
       - decl: 每条css规则的节点信息
       - prop: 样式名，如width
       - value: 样式值， 如10px
     - type: 类型
     - source: 包括start和end的位置信息，start和end里都有line和column表示行和列
     - selector: type为rule时的选择器
     - name: type为atRule时@紧接rule名，譬如@import 'xxx.css'中的import
     - params: type为atRule时@紧接rule名后的值，譬如@import 'xxx.css'中的xxx.css
     - text: type为comment时的注释内容

    <b>2. postCss操作方法</b>

    - 遍历
      - walk: 遍历所有节点信息，无论是atRule、rule、comment的父类型，还是rule、 decl的子类型
      - walkAtRules：遍历所有的atRule
      - walkComments
      - walkDecls
      - walkRules

    这些方法都暴露出遍历对象的参数：
    ```
    root.walkDecls(decl => {
        decl.prop = decl.prop.split('').reverse().join('');
    });
    ```
    <b>3.处理</b>
    - 如同jquery给出了很多操作dom节点的方法一样，postCss给出了很多操作css规则的方法，每种类型的节点稍微不同 查看[官方API]('http://api.postcss.org/')

    处理css
    - 搞清楚了postcss为我们提供的css ast结构和提供的操作函数后一切就好办了。无非是找到我们要处理的节点，对于要处理的内容做一些增减或者替换操作。
       - 编写postcss plugin
       - 也可以直接利用postcss.parse方法拿到css ast后分析处理调用toResult().css拿到处理后的css输出
    
    <b>4.编写插件</b>
    - postcss插件如同babel插件一样，有固定的格式
    ```
    export default postcss.plugin('postcss-plugin-name', function (opts) {
        opts = opts || {};
        return function (root, result) {
            // 处理逻辑
        };
    });
    ```

    注册个插件名，并获取插件配置参数opts

    返回值是个函数，这个函数主体是你的处理逻辑，有2个参数，一个是root，css ast的根节点。另一个是result，返回结果对象，譬如result.css，获得处理结果的css字符串，result.message包含组件里创建的warnings和自定义信息，result.warn()创造一个warning实例并将其加入到result.message中，result.warnings()获得所有创建过的warning。

    注意组件的异常信息处理，不要直接console，因为一些 postcss 处理器会过滤掉console的输出导致异常信息丢失，用node.warn或者node.error创造CssSyntaxError 实例，会自动带上源码中的位置信息帮助debug，加到异常信息队列里。

[官方插件指南](https://github.com/postcss/postcss/blob/master/docs/guidelines/plugin.md)

PostCSS官方提供插件编写的模板，只需要将其下载下来：
```
git clone https://github.com/postcss/postcss-plugin-boilerplate.git
````

假设我们检测到某个样式中有"color: red"这样一条样式规则，需要自动增加"background-color: red"， 且rem 和 px 单位之间的互换 这样一条规则。

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



## 八、 参考

- 最权威的初认识 https://github.com/postcss/postcss
- AST等插件解析 http://rapheal.sinaapp.com/2014/05/15/uglifyjs-ast-parse/
- 一个不错的东西 rework https://github.com/reworkcss
- 
