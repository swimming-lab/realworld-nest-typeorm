import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { IsEmail } from '@nestjs/class-validator';
import * as argon2 from 'argon2';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await argon2.hash(this.password);
  // }
}
