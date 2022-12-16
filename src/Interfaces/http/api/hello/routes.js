const routes = () => ([
  {
    method: 'GET',
    path: '/hello',
    handler: (request, h) => h.response({
      message: 'helo world',
    }),
  },
]);

module.exports = routes;
