import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { CommentType } from "../types/CommentType";
import { getCommentService } from "../services";

export const commentQueries = {
  comments: {
    type: new GraphQLList(CommentType),
    resolve() {
      return getCommentService().getAllComments();
    }
  },

  commentById: {
    type: CommentType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(_: unknown, args: { id: string }) {
      return getCommentService().getCommentById(args.id);
    }
  },
};
