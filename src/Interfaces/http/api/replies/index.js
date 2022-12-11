const routes = require('./routes');
const ReplyHandler = require('./handler');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const replyHandler = new ReplyHandler(container);
    server.route(routes(replyHandler));
  },
};
