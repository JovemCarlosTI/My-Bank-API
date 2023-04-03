import { GraphQLSchema, GraphQLObjectType } from "graphql";
import accountQueries from './queries/account.query.js';
import accountMutation from "./mutations/account.mutation.js";

const Schema = new GraphQLSchema({
    types: null,
    query: new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            ...accountQueries
        }
    }),
    mutation: new GraphQLObjectType({
        name: "RootMutation",
        fields: {
            ...accountMutation
        }
    })
})

export default Schema;