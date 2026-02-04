import { UserService } from "../services/UserService";
import { PostService } from "../services/PostService";
import { CommentService } from "../services/CommentService";

export async function seed(
  userService: UserService,
  postService: PostService,
  commentService: CommentService
) {
  // Seed Users
  const users = [
    {
      name: "Alice",
      email: "alice@example.com",
      password: "123456",
      age: 30,
      height: 165.5,
      weight: 60.0,
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: "123456",
      age: 25,
      height: 175.0,
      weight: 70.0,
    },
    {
      name: "Diogo",
      email: "diogo@example.com",
      password: "123456",
      age: 28,
      height: 180.0,
      weight: 80.0,
    },
    {
      name: "Mayla",
      email: "mayla@example.com",
      password: "123456",
      age: 22,
      height: 160.0,
      weight: 55.0,
    },
    {
      name: "user",
      email: "user@example.com",
      password: "123456",
      age: 30,
      height: 165.5,
      weight: 60.0,
    },
    {
      name: "admin",
      email: "admin@example.com",
      password: "123456",
      age: 35,
      height: 170.0,
      weight: 75.0,
    }
  ];

  for (const userData of users) {
    await userService.createUser(userData);
  }

  // Seed Posts
  const allUsers = await userService.getAllUsers();
  for (const user of allUsers) {
    for (let i = 1; i <= 2; i++) {
      await postService.createPost({
        title: `Post ${i} by ${user.name}`,
        content: `This is the content of post ${i} by ${user.name}.`,
        userId: user.id,
      });
    }
  }

  // Seed Comments
  const allPosts = await postService.getAllPosts();
  for (const post of allPosts) {
    for (let j = 1; j <= 2; j++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      await commentService.createComment({
        content: `This is comment ${j} on post ${post.title}.`,
        postId: post.id,
      });
    }
  }
}