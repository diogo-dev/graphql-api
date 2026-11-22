import { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { CommentType } from '../types/CommentType';
import { getCommentService } from '../services';
import { CreateCommentDTO } from '../../dto/CreateCommentDTO';

export const commentMutations = {
  createComment: {
    type: CommentType,
    args: {
      content: { type: new GraphQLNonNull(GraphQLString) },
      postId: { type: new GraphQLNonNull(GraphQLID) },
      userId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(_: unknown, args: CreateCommentDTO) {
      return getCommentService().createComment({ ...args });
    }
  },

  updateComment: {
    type: CommentType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      content: { type: GraphQLString },
    },
    resolve(_: unknown, args: { id: string; content?: string }) {
      const updateData: { content?: string } = {};
      if (args.content !== undefined) updateData.content = args.content;

      return getCommentService().updateComment(args.id, updateData);
    }
  },

  deleteComment: {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: "Deletes a comment. Returns false if not found.",
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(_: unknown, args: { id: string }) {
      return (await getCommentService().deleteComment(args.id)) !== null;
    }
  },
};
