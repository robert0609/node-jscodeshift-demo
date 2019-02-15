/**
* 主模块文件
*/
import 'babel-polyfill';
import a from './a';

/**
 * 入口函数
 */
function main(...args) {
  let bar = `main imports modules: ${a.name}`;
	process.stdout.write(bar);
}

/**
 * 缺省执行main函数
 */
main(...process.argv.slice(2));
