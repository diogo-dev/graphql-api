import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { User } from "../../entities/User";
import { PostType } from "./PostType";
import { isoDateField } from "./scalars";
import { getPostService } from "../services";

export const UserType: GraphQLObjectType = new GraphQLObjectType<User>({
  name: "User",
  description: "A user in the system",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
    height: { type: GraphQLFloat },
    weight: { type: GraphQLFloat },
    createdAt: isoDateField<User>("createdAt"),

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent) {
        return getPostService().getPostsByUserId(parent.id);
      }
    }
  })
});
