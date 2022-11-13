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

  async follow(authId: number, username: string) {
    const user = await this.userRepository.findOneBy({ id: authId });
    if (!user) {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }

    const profile = await this.userRepository.findOneBy({ username: username });
    if (!profile) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOneBy({
      followId: profile.id,
      user: {
        id: user.id
      }
    });

    let isFollow = false;
    if (!follow) {
      const follow = new Follow();
      follow.followId = profile.id;
      follow.user = user;
      await this.followRepository.save(follow);
      isFollow = true;
    }

    return { profile: await profile.toProfileJSONFor(isFollow) };
  }

  async unfollow(authId: number, username: string) {
    const user = await this.userRepository.findOneBy({ id: authId });
    if (!user) {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }

    const profile = await this.userRepository.findOneBy({ username: username });
    if (!profile) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOneBy({
      followId: profile.id,
      user: {
        id: user.id
      }
    });

    if (follow) {
      await this.followRepository.delete(follow.id);
    }

    return { profile: await profile.toProfileJSONFor(false) };
  }
}
