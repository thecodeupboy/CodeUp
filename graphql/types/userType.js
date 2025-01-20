const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    role: String!
    status: String!
    archived: Boolean!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    archivedUsers: [User]
    archivedUser(id: ID!): User  # Query to fetch a specific archived user
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!, role: String!): User
    updateUser(_id: ID!, username: String, email: String, role: String, status: String): User
    deleteUser(_id: ID!): User
    archiveUser(_id: ID!): User
    restoreUser(_id: ID!): User
    deleteArchivedUser(_id: ID!): User
  }
`;

module.exports = typeDefs;
