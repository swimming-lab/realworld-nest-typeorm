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

  async findProfile(id: number, username: string) {
    const profile = await this.userRepository.findOneBy({ username: username });
    if (!profile) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    let toProfileJSONForUser: any;
    if (id) {
      const user = await this.userRepository.findOne({
        relations: {
          follows: true
        },
        where: {
          id: id
        }
      });

      if (user) {
        toProfileJSONForUser = user;
      } else {
        toProfileJSONForUser = false;
      }
    } else {
      toProfileJSONForUser = false;
    }

    return { profile: await profile.toProfileJSONFor(toProfileJSONForUser) };
  }

  async follow(id: number, username: string) {
    const profile = await this.userRepository.findOneBy({ username: username });
    if (!profile) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const _follows = await this.followRepository.findOneBy({
      followId: profile.id,
      user: {
        id: user.id
      }
    });

    if (!_follows) {
      const follow = new Follow();
      follow.followId = profile.id;
      follow.user = user;
      await this.followRepository.save(follow);
    }

    return { profile: await profile.toProfileJSONFor(user) };
  }

  async unfollow(id: number, username: string) {
    return `This action removes a #${id} profile`;
  }
}
