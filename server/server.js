const express = require('express');
const path = require('path');
const db = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;
import { ApolloServer } from 'apollo-server-express';

const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');


// if we're in production, serve client/build as static assets

//Apollo server 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  server.start();
  server.applyMiddleware({ app });
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});
