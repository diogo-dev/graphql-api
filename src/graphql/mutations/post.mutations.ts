import { PostService } from "@/services/PostService";
import { PostType } from "../types/PostType";
import dataSource from "../../config/data-source";
import { Post } from "../../entities/Post";
import { GraphQLNonNull, GraphQLString } from "graphql";

interface CreatePostArgs {
  title: string;
  content: string;
  userId: string;
}

let postService: PostService | null = null;

const getPostService = (): PostService => {
  if (!postService) {
    const postRepository = dataSource.getRepository(Post);
    postService = new PostService(postRepository);
  }
  return postService;
}

export const postMutations = {
  createPost: {
    type: PostType,
    args: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      userId: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_: any, args: CreatePostArgs) {
      const service = getPostService();
      const newPost = await service.createPost({
        title: args.title,
        content: args.content,
        userId: args.userId,
      });
      return newPost;
    }
  }
}