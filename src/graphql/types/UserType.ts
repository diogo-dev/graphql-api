import { GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { User, UserRole } from "../../entities/User";
import { PostType } from "./PostType";
import { isoDateField } from "./scalars";
import { getPostService } from "../services";
import type { GraphQLContext } from "../context";
import { isOwnerOrAdmin } from "../guards";

export const UserRoleType = new GraphQLEnumType({
  name: "UserRole",
  values: {
    USER: { value: UserRole.USER },
    ADMIN: { value: UserRole.ADMIN },
  },
});

export const UserType: GraphQLObjectType = new GraphQLObjectType<User, GraphQLContext>({
  name: "User",
  description: "A user in the system",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: {
      type: GraphQLString,
      description: "Only visible to the user themself and to admins",
      resolve(parent, _args, ctx) {
        return isOwnerOrAdmin(ctx.user, parent.id) ? parent.email : null;
      }
    },
    role: { type: new GraphQLNonNull(UserRoleType) },
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
