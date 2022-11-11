import { Controller, Get, Post, Body, Put, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async post(@Body('user') createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('/users/login')
  async login(@Body('user') loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @Get('/user')
  async get(@Req() req: Request) {
    return await this.userService.findOne(req['auth'].id);
  }

  @Put('/user')
  update(@Req() req: Request, @Body('user') updateUserDto: UpdateUserDto) {
    return this.userService.update(req['auth'].id, updateUserDto);
  }

  @Delete('/user')
  remove(@Req() req: Request) {
    return this.userService.remove(req['auth'].id);
  }
}
