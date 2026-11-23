import { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { PostType } from "../types/PostType";
import { getPostService } from "../services";
import type { GraphQLContext } from "../context";
import { requireAuth, requireOwnerOrAdmin } from "../guards";

async function assertCanModifyPost(ctx: GraphQLContext, postId: string): Promise<boolean> {
  requireAuth(ctx);
  const service = getPostService();
  if (!(await service.getPostById(postId))) {
    return false;
  }
  const author = await service.getPostAuthor(postId);
  requireOwnerOrAdmin(ctx, author?.id);
  return true;
}

export const postMutations = {
  createPost: {
    type: PostType,
    args: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(_: unknown, args: { title: string; content: string }, ctx: GraphQLContext) {
      const user = requireAuth(ctx);
      return getPostService().createPost({ ...args, userId: user.id });
    }
  },

  updatePost: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
    },
    async resolve(_: unknown, args: { id: string; title?: string; content?: string }, ctx: GraphQLContext) {
      if (!(await assertCanModifyPost(ctx, args.id))) {
        return null;
      }

      const updateData: { title?: string; content?: string } = {};
      if (args.title !== undefined) updateData.title = args.title;
      if (args.content !== undefined) updateData.content = args.content;

      return getPostService().updatePost(args.id, updateData);
    }
  },

  deletePost: {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: "Deletes a post and, by cascade, its comments. Returns false if not found.",
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(_: unknown, args: { id: string }, ctx: GraphQLContext) {
      if (!(await assertCanModifyPost(ctx, args.id))) {
        return false;
      }
      return (await getPostService().deletePost(args.id)) !== null;
    }
  },
};
