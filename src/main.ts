import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(
    new ValidationPipe({
       whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )
  
  await app.listen(process.env.PORT);

  console.log(`
    Listening at PORT: ${process.env.PORT}
    @org: Profaxno Company.
    @address: Santiago, Chile.
    @enviroment: ${process.env.ENV}

    pokedex running...`);
}
bootstrap();
