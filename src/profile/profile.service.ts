import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>) {}

  async findProfile(authId: number, username: string) {
    const profile = await this.userRepository.findOneBy({ username: username });
    if (!profile) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    let isFollow = false;
    if (authId) {
      // const user = await this.userRepository.findOne({
      //   relations: {
      //     follows: true
      //   },
      //   where: {
      //     id: authId
      //   }
      // });

      const follow = await this.followRepository.findOneBy({
        followId: profile.id,
        user: {
          id: authId
        }
      });

      if (follow) {
        isFollow = true;
      }
    }

    return { profile: await profile.toProfileJSONFor(isFollow) };
  }

  async follow(auth: User, username: string) {
    const profile = await this.userRepository.findOneBy({ username: username });
    if (!profile) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOneBy({
      followId: profile.id,
      user: {
        id: auth.id
      }
    });

    let isFollow = false;
    if (!follow) {
      const follow = new Follow();
      follow.followId = profile.id;
      follow.user = auth;
      await this.followRepository.save(follow);
      isFollow = true;
    }

    return { profile: await profile.toProfileJSONFor(isFollow) };
  }

  async unfollow(auth: User, username: string) {
    const profile = await this.userRepository.findOneBy({ username: username });
    if (!profile) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOneBy({
      followId: profile.id,
      user: {
        id: auth.id
      }
    });

    if (follow) {
      await this.followRepository.delete(follow.id);
    }

    return { profile: await profile.toProfileJSONFor(false) };
  }
}
