import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
