import { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLList } from "graphql";
import { Comment } from "../../entities/Comment";
import { CommentType } from "./CommentType";
import dataSource from "../../config/data-source";
import { CommentService } from "@/services/CommentService";

let commentService: CommentService | null = null;

const getCommentService = (): CommentService => {
  if (!commentService) {
    const commentRepository = dataSource.getRepository(Comment);
    commentService = new CommentService(commentRepository);
  }
  return commentService;
}

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
      const service = getCommentService();
      return service.getCommentsByPostId(parent.id);
      }
    }
  },
})