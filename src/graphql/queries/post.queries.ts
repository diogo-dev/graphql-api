import { PostService } from "../../services/PostService"
import dataSource from "../../config/data-source"
import { Post } from "../../entities/Post";
import { GraphQLID, GraphQLList } from "graphql";
import { PostType } from "../types/PostType";

let postService: PostService | null = null;

const getPostService = (): PostService => {
  if (!postService) {
    const postRepository = dataSource.getRepository(Post);
    postService = new PostService(postRepository);
  }

  return postService;
}

export const postQueries = {

  posts: {
    type: new GraphQLList(PostType),
    resolve() {
      const service = getPostService();
      return service.getAllPosts();
    }
  },

  postById: {
    type: PostType,
    args: {
      id: { type: GraphQLID }
    },
    resolve(_: any, args: { id: string }) {
      const service = getPostService();
      return service.getPostById(args.id);
    },
  }

}