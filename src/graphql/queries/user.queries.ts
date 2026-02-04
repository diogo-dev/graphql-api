import { GraphQLID, GraphQLList, GraphQLString } from "graphql";
import { UserType } from "../types/UserType";
import { UserService } from "../../services/UserService";
import { User } from "../../entities/User";
import dataSource from "../../config/data-source";

let userService: UserService | null = null;

const getUserService = (): UserService => {
  if (!userService) {
    const userRepository = dataSource.getRepository(User);
    userService = new UserService(userRepository);
  }
  return userService;
}

export const userQueries = {
  
  users: {
    type: new GraphQLList(UserType),
    resolve() {
      const service = getUserService();
      return service.getAllUsers();
    }
  },

  userById: {
    type: UserType,
    args: {
      id: { type: GraphQLID }
    },
    resolve(_: any, args: { id: string }) {
      const service = getUserService();
      return service.getUserById(args.id);
    }
  },

  userByEmail: {
    type: UserType,
    args: {
      email: { type: GraphQLString}
    },
    resolve(_: any, args: { email: string} ) {
      const service = getUserService();
      return service.getUserByEmail(args.email);
    }
  }
}