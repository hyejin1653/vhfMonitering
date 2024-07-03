const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    getList: [VHFList]
  }
`;

module.exports = typeDefs;
