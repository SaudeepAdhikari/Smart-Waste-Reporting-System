import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { ReportsModule } from './reports.module';
import { HealthModule } from './health.module';
import { UsersModule } from './users.module';
import { DatabaseService } from './config/database.service';
import { config } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    UsersModule,
    ReportsModule,
    HealthModule,
  ],
  providers: [DatabaseService],
})
export class AppModule {}
