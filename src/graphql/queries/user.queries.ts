import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "../types/UserType";
import { getUserService } from "../services";

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
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(_: unknown, args: { email: string }) {
      return getUserService().getUserByEmail(args.email);
    }
  }
};
