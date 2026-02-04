import dataSource from "../../config/data-source";
import { Post } from "../../entities/Post";
import { PostType } from "./PostType";
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";


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
        return dataSource
          .getRepository(Post)
          .createQueryBuilder("post")
          .where("post.userId = :userId", { userId: parent.id })
          .getMany();
      }
    }
  }
})