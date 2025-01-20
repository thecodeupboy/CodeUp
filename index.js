const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require("./graphql/schema");
const { checkAuth } = require('./middleware/verifyUser');

const app = express();
require('./dbconnections/dbconnection'); 
const authRouter = require('./routes/auth'); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use(express.static('public'));
app.use('/thumbnails', express.static('public/thumbnails'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {headers: req.headers };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${process.env.PORT}${server.graphqlPath}`);
  });
}

startApolloServer();
