import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { ReportsModule } from './reports.module';
import { DatabaseService } from './config/database.service';
import { config } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    ReportsModule,
  ],
  providers: [DatabaseService],
})
export class AppModule {}
