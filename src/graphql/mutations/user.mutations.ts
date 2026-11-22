import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "../types/UserType";
import { getUserService } from "../services";
import { CreateUserDTO } from "../../dto/CreateUserDTO";

type UpdateUserArgs = Partial<Omit<CreateUserDTO, "password">> & { id: string };

export const userMutations = {
  createUser: {
    type: UserType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      age: { type: GraphQLInt },
      height: { type: GraphQLFloat },
      weight: { type: GraphQLFloat },
    },
    resolve(_: unknown, args: CreateUserDTO) {
      return getUserService().createUser({ ...args });
    }
  },

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
    resolve(_: unknown, { id, ...fields }: UpdateUserArgs) {
      // Only include fields that were actually provided
      const updateData = Object.fromEntries(
        Object.entries(fields).filter(([, value]) => value !== undefined)
      );
      return getUserService().updateUser(id, updateData);
    }
  },

  deleteUser: {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: "Deletes a user and, by cascade, their posts and comments. Returns false if not found.",
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(_: unknown, args: { id: string }) {
      return (await getUserService().deleteUser(args.id)) !== null;
    }
  },
};
