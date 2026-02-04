
import { UserType } from "../types/UserType";
import { UserService } from "../../services/UserService";
import dataSource from "../../config/data-source";
import { User } from "../../entities/User";
import { GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";

interface CreateUserArgs {
  name: string;
  email: string;
  password: string;
  age?: number;
  height?: number;
  weight?: number;
}

let userService: UserService | null = null;

function getUserService(): UserService {
  if (!userService) {
    const userRepository = dataSource.getRepository(User);
    userService = new UserService(userRepository);
  }
  return userService;
}

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
    async resolve(_: any, args: CreateUserArgs) {
      const service = getUserService();
      const newUser = await service.createUser({
        name: args.name,
        email: args.email,
        password: args.password,
        age: args.age,
        height: args.height,
        weight: args.weight,
      });
      return newUser;
    }
  }
}