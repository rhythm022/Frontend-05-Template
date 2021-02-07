var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

  }

  async initPackage() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname, // Default to current folder name
      },
      // {
      //   type: "confirm",
      //   name: "cool",
      //   message: "Would you like to enable the Cool feature?"
      // }
    ]);

    const pkgJson = {

      'name': answers.name,
      'version': '1.0.0',
      'main': '/src/main.js',
      'license': 'MIT',
      'scripts': {
        'build': 'webpack --config webpack.config.js',
        'test': 'mocha --require @babel/register',
        "coverage": "nyc mocha"
      },
      'devDependencies': {},
      'dependencies': {},
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);

    this.npmInstall(['vue'], {'save-dev': false});
    this.npmInstall([
      'webpack-cli@4.2.0',
      'webpack@4.46.0',
      'vue-loader',
      'css-loader',
      'vue-style-loader',
      'vue-template-compiler',
      'copy-webpack-plugin@6.0.0',
      '@babel/core',
      '@babel/preset-env',
      '@babel/register',
      '@istanbuljs/nyc-config-babel',
      'babel-plugin-istanbul',
      'mocha',
      'nyc',
      'babel-loader',
    ], {'save-dev': true});

    this.fs.copyTpl(
        this.templatePath('Hello.vue'),
        this.destinationPath('src/Hello.vue'),
    );

    this.fs.copyTpl(
        this.templatePath('main.js'),
        this.destinationPath('src/main.js'),
    );

    this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('src/index.html'), {
          title: answers.name,
        },
    );

    this.fs.copyTpl(
        this.templatePath('test-demo.js'),
        this.destinationPath('test/test-demo.js'),
    );

    this.fs.copyTpl(
        this.templatePath('webpack.config.js'),
        this.destinationPath('webpack.config.js'),
    );

    this.fs.copyTpl(
        this.templatePath('.nycrc'),
        this.destinationPath('.nycrc'),
    );
    this.fs.copyTpl(
        this.templatePath('.babelrc'),
        this.destinationPath('.babelrc'),
    );

  }

};
