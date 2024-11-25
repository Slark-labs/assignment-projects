import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './common/token/jwt.module';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    MongooseModule.forRoot(`${process.env.DATABASE_URL}`, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('✅ MongoDB connected successfully');
        });
        connection.on('error', (err: string) => {
          console.error('❌ MongoDB connection error:', err);
        });
        console.log('Database URL:', process.env.DATABASE_URL);

        return connection;
      },
    }),
    AuthModule,
    JwtModule,
    UserModule,
  ],
  exports: [JwtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
