const express = require("express");
const app = express();
const { ApolloServer } = require("apollo-server-express");
const bodyParser = require("body-parser");
const mainRouter = require("./routes/main");

const queries = require("./graphql/_queries");
const vhf = require("./js/vhf");

let typeDefs = [queries, vhf.typeDefs];
let resolvers = [vhf.resolvers];

const main = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });
};

main();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/main", mainRouter);

app.listen({ port: 4000 });
console.log(`🚀 Server ready at http://localhost:4000`);

// app.listen().then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });
