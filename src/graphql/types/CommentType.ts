import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from "graphql"

export const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "A comment made by a user in a post",
  fields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    content: {type: new GraphQLNonNull(GraphQLID)},
  }
})