import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQueries } from "./queries/user.queries";
import { userMutations } from "./mutations/user.mutations";
import { postQueries } from "./queries/post.queries";
import { commentQueries } from "./queries/comment.queries";
import { postMutations } from "./mutations/post.mutations";
import { commentMutations } from "./mutations/comment.mutations";


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userQueries,
    ...postQueries,
    ...commentQueries,
  }
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...userMutations,
    ...postMutations,
    ...commentMutations
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});