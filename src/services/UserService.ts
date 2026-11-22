import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import bcrypt from 'bcrypt';
import { validateDto } from '../utils/validate';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async createUser(userData: CreateUserDTO): Promise<User> {
    await validateDto(CreateUserDTO, userData);

    const existingUser = await this.getUserByEmail(userData.email!);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // hashing the user password before saving
    const salt = 10;
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashedPassword;

    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id }, relations: ['posts'] });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email }, relations: ['posts'] });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['posts'] });
  }

  async updateUser(id: string, updateData: Partial<CreateUserDTO>): Promise<User | null> {
    await validateDto(CreateUserDTO, updateData, { partial: true });

    const user = await this.getUserById(id);
    if (!user) {
      return null;
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.getUserByEmail(updateData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    return await this.userRepository.save({ ...user, ...updateData });
  }

  async updateUserPassword(id: string, newPassword: string): Promise<User | null> {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.userRepository.update(id, { password: hashedPassword });
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<User | null> {
    const user = await this.getUserById(id);
    if (!user) {
      return null;
    }

    return await this.userRepository.remove(user);
  }
}
