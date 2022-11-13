import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { IsEmail } from '@nestjs/class-validator';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import { Follow } from '../profile/follow.entity';

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

  @OneToMany(() => Follow, (follow) => follow.user)
  follows: Follow[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  async updatePassword(password: string) {
    this.password = await argon2.hash(password);
  }

  async validatePassword(password: string) {
    return await argon2.verify(this.password, password);
  }

  async generateJWT() {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        id: this.id,
        username: this.username,
        exp: parseInt(String(exp.getTime() / 1000)),
      },
      SECRET,
    );
  }

  async toAuthJSON() {
    return {
      username: this.username,
      email: this.email,
      token: await this.generateJWT(),
      bio: this.bio,
      image: this.image,
    };
  }

	async toProfileJSONFor(isFollow: boolean) {
		return {
			username: this.username,
			bio: this.bio,
			image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
			following: isFollow
		};
	}
}