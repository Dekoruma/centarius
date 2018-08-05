const notifier = require('../../utils/notify');
const { createBabelConfig, commonJSOpts } = require('../../utils/babel-preset');

const notify = (msg) => notifier(msg, 'State HOC');

export async function source(task, opts) {
  await task
    .source(opts.src || 'src/**/*.js')
    .babel(createBabelConfig({ modules: opts.modules || false }))
    .target(opts.target || 'dist');

  notify('Files have been compiled');
}

export async function buildES(task) {
  await task.clear('dist').start('source');
}

export async function buildCommonJS(task) {
  await task.clear('dist/cjs').start('source', commonJSOpts);
}

export default async function(task) {
  await task.parallel(['buildES', 'buildCommonJS']);
  await task.watch('src/index.js', 'source');
  await task.watch('src/index.js', 'source', commonJSOpts);
}

export async function release(task) {
  await task.parallel(['buildES', 'buildCommonJS']);
}
