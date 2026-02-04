import { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLList } from "graphql";
import { Comment } from "../../entities/Comment";
import { CommentType } from "./CommentType";
import dataSource from "../../config/data-source";

export const PostType = new GraphQLObjectType({
  name: "Post",
  description: "A blog post created by a user",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },

    comments: {
    type: new GraphQLList(CommentType),
    resolve(parent) {
      return dataSource 
        .getRepository(Comment)
        .createQueryBuilder("comment")
        .where("comment.post_id = :postId", { postId: parent.id })
        .getMany();
      }
    }
  },
})