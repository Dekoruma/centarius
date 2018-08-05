const notifier = require('node-notifier');

module.exports = (msg, title) =>
  notifier.notify({
    title: `⇛ Centarius${title ? ` - ${title}` : ''} `,
    message: msg,
    icon: false,
  });
