import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtGuard } from '../common/jwt.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtGuard],
  exports: [UsersService], // AuthModule imports this
})
export class UsersModule {}
