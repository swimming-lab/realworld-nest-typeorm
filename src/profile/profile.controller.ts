import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from '../user/user.decorator';

@Controller('/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/:username')
  async getProfile(@User('id') authId: number, @Param('username') username: string) {
    return await this.profileService.findProfile(authId, username);
  }

  @Post('/:username/follow')
  async follow(@Req() req: Request, @Param('username') username: string) {
    return await this.profileService.follow(req['auth'], username);
  }

  @Delete('/:username/follow')
  async unfollow(@Req() req: Request, @Param('username') username: string) {
    return await this.profileService.unfollow(req['auth'], username);
  }
}
