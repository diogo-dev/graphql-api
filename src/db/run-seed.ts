import "reflect-metadata";
import dataSource from "../config/data-source";
import { UserService } from "../services/UserService";
import { PostService } from "../services/PostService";
import { CommentService } from "../services/CommentService";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { seed } from "./seed";

async function runSeed() {
  try {
    // Initialize database connection
    await dataSource.initialize();
    console.log("Data Source has been initialized!");

    // Create service instances
    const userService = new UserService(dataSource.getRepository(User));
    const postService = new PostService(dataSource.getRepository(Post));
    const commentService = new CommentService(dataSource.getRepository(Comment));

    // Run the seed function
    console.log("Starting database seeding...");
    await seed(userService, postService, commentService);
    console.log("Database seeded successfully!");

    // Close the connection
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

runSeed();
