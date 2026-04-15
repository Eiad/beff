import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { JwtGuard } from '../common/jwt.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { UpdateUserSchema } from './schemas/update-user.schema';
import type { UpdateUserDto } from './schemas/update-user.schema';

@Controller('users')
@UseGuards(JwtGuard) // All routes in this controller require a valid JWT
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me — return current user's profile
  @Get('me')
  getMe(@Req() req: { user: ReturnType<UsersService['findById']> }) {
    return req.user;
  }

  // PATCH /users/me — update display name
  @Patch('me')
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  updateMe(
    @Req() req: { user: NonNullable<ReturnType<UsersService['findById']>> },
    @Body() body: UpdateUserDto,
  ) {
    const updated = this.usersService.update(req.user.id, body.name);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  // GET /users/me/export — GDPR: right to data portability
  @Get('me/export')
  exportData(
    @Req() req: { user: NonNullable<ReturnType<UsersService['findById']>> },
    @Res() res: Response,
  ) {
    const date = new Date().toISOString().split('T')[0];
    const data = {
      exportedAt: new Date().toISOString(),
      user: req.user,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="beff-data-export-${date}.json"`,
    );
    res.send(JSON.stringify(data, null, 2));
  }

  // DELETE /users/me — GDPR: right to erasure (offboarding)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMe(
    @Req() req: { user: NonNullable<ReturnType<UsersService['findById']>> },
  ) {
    this.usersService.delete(req.user.id);
  }
}
