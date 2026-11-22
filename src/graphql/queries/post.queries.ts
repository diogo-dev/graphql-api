import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { PostType } from "../types/PostType";
import { getPostService } from "../services";

export const postQueries = {
  posts: {
    type: new GraphQLList(PostType),
    resolve() {
      return getPostService().getAllPosts();
    }
  },

  postById: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(_: unknown, args: { id: string }) {
      return getPostService().getPostById(args.id);
    },
  }
};
