学习笔记





# 搭建一个toolchain
1. npm初始化项目
```shell
npm init 
//name项需要以 generator-开头，比如generator-toolchain
```
2. 安装yeoman
```shell
yarn add yeoman-generator
```

3. 建立项目文件夹和文件
```shell
mkdir -p generators/app
touch generators/app/index.js
```

4. 编写generators/app/index.js文件
```js
var Generator = require("yeoman-generator");

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}

	method1() {
		console.log("this is method1");
	}

	method2() {
		console.log("this is method2");
	}
};
```

5. 根目录运行命令测试
```shell
npx yo toolchain
```
看到以下结果，说明运行成功啦！
![p1][p1]

6. 使用异步function与用户进行交互,修改generators/app/index.js文件, 在method2后新增一个方法，内容如下:
```js
	async prompting() {
		const answers = await this.prompt([
			{
				type: "input",
				name: "name",
				message: "Your project name",
				default: this.appname, // Default to current folder name
			},
			{
				type: "confirm",
				name: "cool",
				message: "Would you like to enable the Cool feature?",
			},
		]);

		this.log("app name", answers.name);
		this.log("cool feature", answers.cool);
	}
```
然后就运行npx yo toolchain测试与用户的交互

7. yeoman的文件系统的用法：
https://yeoman.io/authoring/file-system.html

8. yeoman的依赖管理：（第三方模块的安装）
https://yeoman.io/authoring/dependencies.html

# webpack了解
		webpack最初是为了nodejs设计的，并非为了web开发而设计。但现在webpack做web打包非常多， 他的核心思路是最终打包成一个js文件，然后通过手动引入到html文件中, 它可以做多文件的合并，并通过各种loader和plugin去制定各种规则。
		使用webpack需要安装两个包， webpack和webpack-cli,webpack是核心， webpack-cli提供命令。
		webpack配置文件采用commonjs规范：导出一个对象，包含几个基础模块：entry, output, module, plugin
```
module.exports = {
	entry: "",
	output: "",
	module: {
		rules:[]
	}，
	plugins: [],
	resolve: { 
		alias: {// 开发中经常用到，实在resolve模块下
			Utilities: path.resolve(__dirname, 'src/utilities/'),
			Templates: path.resolve(__dirname, 'src/templates/')
		}
	}

}
```

# babel
		Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：
* 语法转换
* 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 @babel/polyfill 模块)
* 源码转换 (codemods)
## preset
		babel的preset是预设的一些转换规则，需要进行配置才能使用，最简单的配置方法，是创建一个.babelrc文件，里面以一个json对象的方式存储配置。
```json
{
	"presets":["@babel/preset-env"]
}
```