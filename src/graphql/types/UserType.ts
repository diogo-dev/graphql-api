import dataSource from "../../config/data-source";
import { Post } from "../../entities/Post";
import { PostType } from "./PostType";
import { PostService } from "@/services/PostService";
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

let postService: PostService | null = null;

const getPostService = (): PostService => {
  if (!postService) {
    const postRepository = dataSource.getRepository(Post);
    postService = new PostService(postRepository);
  }
  return postService;
}

export const UserType = new GraphQLObjectType({
  name: "User",
  description: "A user in the system",
  fields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    age: {type: GraphQLString},
    height: {type: GraphQLString},
    weight: {type: GraphQLString},

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent) {
        const service = getPostService();
        return service.getPostsByUserId(parent.id);
      }
    }
  }
})