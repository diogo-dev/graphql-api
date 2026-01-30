import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 255})
  title: string;

  @Column({type: 'text'})
  content: string;

  @Column({name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts)
  user: User;
  
}