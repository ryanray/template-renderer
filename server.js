const fastify = require('fastify')({ logger: true });
const path = require('path');
const { UNABLE_TO_FIND_TEMPLATE, resolvePath } = require('./lib/resolver');
const { buildTemplateContext } = require('./lib/context');

const TEMPLATE_DIR = 'templates/';
const ROUTE_PREFIX = process.env.ROUTE_PREFIX || '';

fastify.register(require('point-of-view'), {
  engine: {
    // TODO: support all template types that point-of-view supports
    handlebars: require('handlebars')
  },
  root: path.join(__dirname, TEMPLATE_DIR),
  viewExt: 'hbs',
  options: {}
});

/**
 * Declare a wildcard route to handle all requests - Kind of heavy handed but gets the job done for now.
 *
 * use ROUTE_PREFIX if you want to limit the paths that the server requests.
 *
 * Example: ROUTE_PREFIX=/dashboard node server.js
 * curl http://localhost:3000/ will 404
 * curl http://localhost:3000/profile will serve the profile.hbs template
 *
 */
fastify.get(ROUTE_PREFIX + '*', async (request, reply) => {
  try {
    const calculatedPath = await resolvePath(ROUTE_PREFIX, request.url);
    return reply.view(`/${calculatedPath}`, buildTemplateContext(fastify.log))
  } catch (e) {
    if(e.message === UNABLE_TO_FIND_TEMPLATE) {
      return reply.code(404).send('Not found');
    }
    return reply.code(500).send({error: 'there was a problem.'});
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    process.on('SIGTERM', function onSigterm () {
      fastify.log.info('received command to shutdown... shutting down...');
      process.exit(0);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();


