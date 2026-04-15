import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { RegisterSchema } from './schemas/register.schema';
import type { RegisterDto } from './schemas/register.schema';
import { LoginSchema } from './schemas/login.schema';
import type { LoginDto } from './schemas/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register — onboarding: create account
  @Post('register')
  @HttpCode(HttpStatus.OK) // Override NestJS default 201 for POST
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.name, body.email, body.password);
  }

  // POST /auth/login — onboarding: sign in
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
