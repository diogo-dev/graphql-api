import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema';
import { graphiqlHtml } from './graphql/graphiql';
import { buildContext } from './graphql/context';

const app = express();

// Browsers get GraphiQL; API requests fall through to the handler
if (process.env.NODE_ENV !== 'production') {
  app.get('/graphql', (req, res, next) => {
    if (req.accepts(['application/json', 'text/html']) === 'text/html' && !req.query.query) {
      res.type('html').send(graphiqlHtml);
      return;
    }
    next();
  });
}

app.all('/graphql', createHandler({ schema, context: buildContext }));

export default app;
