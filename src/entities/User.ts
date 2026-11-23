import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { RefreshToken } from "./RefreshToken";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 255, name: 'user_name'})
  name: string;

  @Column({type: 'varchar', length: 255, unique: true})
  email: string;

  @Column({type: 'varchar', length: 255})
  password: string;

  @Column({type: 'int', nullable: true})
  age: number;

  @Column({type: 'float', nullable: true})
  height:number;

  @Column({type: 'float', nullable: true})
  weight:number;

  @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
  role: UserRole;

  @Column({name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => RefreshToken, token => token.user)
  refreshTokens: RefreshToken[];
  
}
