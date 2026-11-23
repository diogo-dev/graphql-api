import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { AuthPayloadType } from "../types/AuthPayloadType";
import { getAuthService } from "../services";
import { CreateUserDTO } from "../../dto/CreateUserDTO";
import type { GraphQLContext } from "../context";
import { requireAuth } from "../guards";

export const authMutations = {
  register: {
    type: new GraphQLNonNull(AuthPayloadType),
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      age: { type: GraphQLInt },
      height: { type: GraphQLFloat },
      weight: { type: GraphQLFloat },
    },
    resolve(_: unknown, args: CreateUserDTO) {
      return getAuthService().register({ ...args });
    }
  },

  login: {
    type: new GraphQLNonNull(AuthPayloadType),
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(_: unknown, args: { email: string; password: string }) {
      return getAuthService().login(args.email, args.password);
    }
  },

  refreshToken: {
    type: new GraphQLNonNull(AuthPayloadType),
    args: {
      token: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(_: unknown, args: { token: string }) {
      return getAuthService().refresh(args.token);
    }
  },

  logout: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(_: unknown, args: { refreshToken: string }) {
      return getAuthService().logout(args.refreshToken);
    }
  },

  changePassword: {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      currentPassword: { type: new GraphQLNonNull(GraphQLString) },
      newPassword: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(_: unknown, args: { currentPassword: string; newPassword: string }, ctx: GraphQLContext) {
      const user = requireAuth(ctx);
      return getAuthService().changePassword(user.id, args.currentPassword, args.newPassword);
    }
  },
};
