import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "../types/UserType";
import { getUserService } from "../services";
import type { GraphQLContext } from "../context";
import { requireRole } from "../guards";
import { UserRole } from "../../entities/User";

export const userQueries = {
  users: {
    type: new GraphQLList(UserType),
    resolve() {
      return getUserService().getAllUsers();
    }
  },

  userById: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(_: unknown, args: { id: string }) {
      return getUserService().getUserById(args.id);
    }
  },

  userByEmail: {
    type: UserType,
    description: "Admin only",
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(_: unknown, args: { email: string }, ctx: GraphQLContext) {
      requireRole(ctx, UserRole.ADMIN);
      return getUserService().getUserByEmail(args.email);
    }
  }
};
