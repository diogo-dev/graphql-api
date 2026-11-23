import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { UserRoleType, UserType } from "../types/UserType";
import { getUserService } from "../services";
import { CreateUserDTO } from "../../dto/CreateUserDTO";
import { UserRole } from "../../entities/User";
import type { GraphQLContext } from "../context";
import { requireOwnerOrAdmin, requireRole } from "../guards";

type UpdateUserArgs = Partial<Omit<CreateUserDTO, "password">> & { id: string };

export const userMutations = {
  updateUser: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      age: { type: GraphQLInt },
      height: { type: GraphQLFloat },
      weight: { type: GraphQLFloat },
    },
    resolve(_: unknown, { id, ...fields }: UpdateUserArgs, ctx: GraphQLContext) {
      requireOwnerOrAdmin(ctx, id);
      const updateData = Object.fromEntries(
        Object.entries(fields).filter(([, value]) => value !== undefined)
      );
      return getUserService().updateUser(id, updateData);
    }
  },

  setUserRole: {
    type: UserType,
    description: "Admin only",
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      role: { type: new GraphQLNonNull(UserRoleType) },
    },
    resolve(_: unknown, args: { id: string; role: UserRole }, ctx: GraphQLContext) {
      requireRole(ctx, UserRole.ADMIN);
      return getUserService().setUserRole(args.id, args.role);
    }
  },

  deleteUser: {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: "Deletes a user and, by cascade, their posts and comments. Returns false if not found.",
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(_: unknown, args: { id: string }, ctx: GraphQLContext) {
      requireOwnerOrAdmin(ctx, args.id);
      return (await getUserService().deleteUser(args.id)) !== null;
    }
  },
};
