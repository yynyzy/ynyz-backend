import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user';
// import { ConfigModule } from '@nestjs/config';
// import dbConfig from 'src/config/db.config';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [dbConfig],
    //   envFilePath: [`.env.${process.env.NODE_ENV}`],
    // }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     ...(await configService.get('database')),
    //   }),
    //   inject: [ConfigService],
    // }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
