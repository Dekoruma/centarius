const notifier = require('node-notifier');

const createBabelConfig = require('.utils/babel-preset');

const commonJSOpts = {
  modules: 'commonjs',
  target: 'dist/cjs',
};

// notification helper
function notify(msg) {
  return notifier.notify({
    title: '⇛ Centarius',
    message: msg,
    icon: false,
  });
}

export async function source(task, opts) {
  await task
    .source(opts.src || 'src/**/*.js')
    .babel(createBabelConfig({ modules: opts.modules || false }))
    .target(opts.target || 'dist');

  notify('Files have been compiled');
}

export async function buildES(task) {
  await task.clear('dist').parallel(['source']);
}

export async function buildCommonJS(task) {
  await task.clear('dist/cjs').parallel(['source'], commonJSOpts);
}

export default async function(task) {
  await task.parallel(['buildES', 'buildCommonJS']);
  await task.watch('src/index.js', 'source');
  await task.watch('src/index.js', 'source', commonJSOpts);
}

export async function release(task) {
  await task.parallel(['buildES', 'buildCommonJS']);
}
