import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema';
import { graphiqlHtml } from './graphql/graphiql';

const app = express();

// Serve the GraphiQL IDE to browsers outside production.
// Requests carrying a `query` param (or non-HTML Accept headers) fall through to the API handler.
if (process.env.NODE_ENV !== 'production') {
  app.get('/graphql', (req, res, next) => {
    if (req.accepts(['application/json', 'text/html']) === 'text/html' && !req.query.query) {
      res.type('html').send(graphiqlHtml);
      return;
    }
    next();
  });
}

app.all('/graphql', createHandler({ schema }));

export default app;
