// TODO: make configurable
const regex = /^TMPL_/;

/**
 * Template context is the data that is passed to a template.
 *
 * As of 0.0.1 any environment variable that starts with TMPL_ will be added to the context
 * on each request.
 *
 */
function buildTemplateContext(logger) {
  const context = {};
  for(let prop in process.env) {
    if(regex.test(prop)) {
      context[prop] = process.env[prop];
    }
  }
  logger.info('context:', JSON.stringify(context, null, 2));
  return context;
}
module.exports = { buildTemplateContext };
