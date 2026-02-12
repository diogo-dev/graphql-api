import { GraphQLNonNull, GraphQLString } from 'graphql';
import { CommentType } from '../types/CommentType';
import { CommentService } from '../../services/CommentService';
import dataSource from '../../config/data-source';
import { Comment } from '../../entities/Comment';


interface CreateCommentArgs {
  content: string;
  postId: string;
}

let commentService: CommentService | null = null;

const getCommentService = (): CommentService => {
  if (!commentService) {
    const commentRepository = dataSource.getRepository(Comment);
    commentService = new CommentService(commentRepository);
  }
  return commentService;
}

export const commentMutations = {
  createComment: {
    type: CommentType,
    args: {
      content: { type: new GraphQLNonNull(GraphQLString) },
      postId: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_: any, args: CreateCommentArgs) {
      const service = getCommentService();
      const newComment = await service.createComment({
        content: args.content,
        postId: args.postId,
      });
      return newComment;
    }
  },

  updateComment: {
    type: CommentType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: GraphQLString },
    },
    async resolve(_: any, args: { id: string; content?: string }) {
      const service = getCommentService();

      const updateData: Partial<Comment> = {};
      if (args.content !== undefined) updateData.content = args.content;
      
      const updatedComment = await service.updateComment(args.id, updateData);
      return updatedComment;
    }
  }
}