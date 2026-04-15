import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Controller()
class HealthController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}

@Module({
  imports: [
    // Load .env globally — available in all modules via process.env
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
