import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQueries } from "./queries/user.queries";
import { userMutations } from "./mutations/user.mutations";


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userQueries,
  }
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...userMutations,
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});