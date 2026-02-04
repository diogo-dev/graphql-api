import { Repository } from "typeorm";
import { Post } from "../entities/Post";
import { CreatePostDTO } from "../dto/CreatePostDTO";
import { User } from "@/entities/User";

export class PostService {
  constructor(
    private postRepository: Repository<Post>
  ) {}

  async createPost(postData: CreatePostDTO): Promise<Post> {
    const post = this.postRepository.create({
      title: postData.title,
      content: postData.content,
      user: { id: postData.userId } as User 
    });

    try {
      return await this.postRepository.save(post);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new Error("User not found");
      }
      throw error;
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    return await this.postRepository.findOne({ where: { id } });
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async updatePost(id: string, updateData: Partial<Post>): Promise<Post | null> {
    const post = await this.getPostById(id);
    if (!post) {
      return null;
    }

    return await this.postRepository.save({ ...post, ...updateData });
  }

  async deletePost(id: string): Promise<Post | null> {
    const post = await this.getPostById(id);
    if (!post) {
      return null;
    }

    return await this.postRepository.remove(post);
  }

}