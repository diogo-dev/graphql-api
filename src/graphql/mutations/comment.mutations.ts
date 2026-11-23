import { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { CommentType } from '../types/CommentType';
import { getCommentService } from '../services';
import type { GraphQLContext } from '../context';
import { requireAuth, requireOwnerOrAdmin } from '../guards';

async function assertCanModifyComment(ctx: GraphQLContext, commentId: string): Promise<boolean> {
  requireAuth(ctx);
  const service = getCommentService();
  if (!(await service.getCommentById(commentId))) {
    return false;
  }
  const author = await service.getCommentAuthor(commentId);
  requireOwnerOrAdmin(ctx, author?.id);
  return true;
}

export const commentMutations = {
  createComment: {
    type: CommentType,
    args: {
      content: { type: new GraphQLNonNull(GraphQLString) },
      postId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(_: unknown, args: { content: string; postId: string }, ctx: GraphQLContext) {
      const user = requireAuth(ctx);
      return getCommentService().createComment({ ...args, userId: user.id });
    }
  },

  updateComment: {
    type: CommentType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      content: { type: GraphQLString },
    },
    async resolve(_: unknown, args: { id: string; content?: string }, ctx: GraphQLContext) {
      if (!(await assertCanModifyComment(ctx, args.id))) {
        return null;
      }

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
    async resolve(_: unknown, args: { id: string }, ctx: GraphQLContext) {
      if (!(await assertCanModifyComment(ctx, args.id))) {
        return false;
      }
      return (await getCommentService().deleteComment(args.id)) !== null;
    }
  },
};
