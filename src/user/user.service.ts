import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    const savedUser = await this.userRepository.save(user);
    return { user: await savedUser.toAuthJSON() };
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findOneBy({ email: email });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }

    if (user.validatePassword(password)) {
      return { user: await user.toAuthJSON() };
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }

    return { user: await user.toAuthJSON() };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }

    if (typeof updateUserDto.username !== 'undefined') {
      user.username = updateUserDto.username;
    }
    if (typeof updateUserDto.email !== 'undefined') {
      user.email = updateUserDto.email;
    }
    if (typeof updateUserDto.bio !== 'undefined') {
      user.bio = updateUserDto.bio;
    }
    if (typeof updateUserDto.image !== 'undefined') {
      user.image = updateUserDto.image;
    }
    if (typeof updateUserDto.password !== 'undefined') {
      await user.updatePassword(updateUserDto.password);
    }

    const savedUser = await this.userRepository.save(user);
    return { user: await savedUser.toAuthJSON() };
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id: id });
  }
}
