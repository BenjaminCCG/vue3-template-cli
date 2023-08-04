#! /usr/bin/env node
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const chalk = require('chalk');
const prompts = require('prompts');
const ora = require('ora');
const download = require('download-git-repo');
const fs = require('fs');
// 帮助内容
const helpSections = [
  {
    header: 'v3-cli',
    content: '一个快速生成组件库搭建环境的脚手架'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'version',
        typeLabel: '{underline boolean}',
        description: '版本号'
      },
      {
        name: 'arg1',
        typeLabel: '{underline string}',
        description: '参数1'
      },
      {
        name: 'arg2',
        typeLabel: '{underline number}',
        description: '参数2'
      }
    ]
  }
];

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'arg1', type: String },
  { name: 'arg2', type: Number }
];

const options = commandLineArgs(optionDefinitions);

if (options.help) console.log(chalk.green(commandLineUsage(helpSections)));

const promptsOptions = [
  {
    type: 'text', // 单选
    name: 'name',
    message: 'project-name',
    validate(val) {
      if (!val) return '模板名称不能为空！';
      if (fs.existsSync(val)) return '项目名已存在';
      if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) return '模板名称包含非法字符，请重新输入';
      return true;
    }
  },

  {
    type: 'select', // 单选
    name: 'template',
    message: 'select a framework',
    choices: [
      { title: 'gitee', value: 1 },
      { title: 'github', value: 2 }
    ]
  }
];

const gitClone = (remote, name, option) => {
  const downSpinner = ora('正在下载模板...').start();
  return new Promise((resolve, reject) => {
    download(remote, name, option, (err) => {
      if (err) {
        downSpinner.fail();
        console.log('err', chalk.red(err));
        reject(err);
        return;
      }
      downSpinner.succeed(chalk.green('模板下载成功！'));
      console.log(`Done. Now run:\r\n`);
      console.log(chalk.green(`cd ${name}`));
      console.log(chalk.blue('npm install'));
      console.log('npm run dev\r\n');
      resolve();
    });
  });
};

const remoteList = {
  1: 'https://gitee.com/theGreatWallCCG/vue3-template-cli.git',
  2: 'https://github.com/BenjaminCCG/vue3-template-cli.git'
};
const branch = 'main';

const getInputInfo = async () => {
  const res = await prompts(promptsOptions);
  if (!res.name || !res.template) return;
  gitClone(`direct:${remoteList[res.template]}#${branch}`, res.name, { clone: true });
};
getInputInfo();
