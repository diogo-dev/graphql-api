import { GraphQLID, GraphQLList, GraphQLString } from "graphql";
import { CommentType } from "../types/CommentType";
import { CommentService } from "../../services/CommentService";
import { Comment } from "../../entities/Comment";
import dataSource from "../../config/data-source";

let commentService: CommentService | null = null;

const getCommentService = (): CommentService => {
  if (!commentService) {
    const commentRepository = dataSource.getRepository(Comment);
    commentService = new CommentService(commentRepository);
  }
  return commentService;
}

export const commentQueries = {
  comments: {
    type: new GraphQLList(CommentType),
    resolve() {
      const service = getCommentService();
      return service.getAllComments();
    }
  },

  commentById: {
    type: CommentType,
    args: {
      id: { type: GraphQLID }
    },
    resolve(_: any, args: { id: string }) {
      const service = getCommentService();
      return service.getCommentById(args.id);
    }
  },

  commentsByPostId: {
    type: new GraphQLList(CommentType),
    args: {
      postId: { type: GraphQLID }
    },
    resolve(_: any, args: { postId: string}) {
      const service = getCommentService();
      return service.getCommentsByPostId(args.postId);
    }
  }
}