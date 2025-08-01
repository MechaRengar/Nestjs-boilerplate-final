import './boilerplate.polyfill';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeTransactionalContext } from 'typeorm-transactional';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { TranslationInterceptor } from './interceptors/translation-interceptor.service';
import { TransformIdInterceptor } from './interceptors/transform-id-interceptor.service';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { TranslationService } from './shared/services/translation.service';
import { SharedModule } from './shared/shared.module';
import { dataSource } from './ormconfig';

async function initializeDatabaseConnections(_configService: ApiConfigService) {
  const dbType = process.env.DB_TYPE || 'postgres';
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
  
  // Initialize MongoDB
  const mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await mongoClient.connect();
    console.log('✅ MongoDB connection established💥🎆🎉');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }

  // Initialize TypeORM
  try {
    await dataSource.initialize();
    console.log(`✅ ${dbType} connection established🚀🎆🎉`);
  } catch (error) {
    console.error(`❌ ${dbType} connection failed:`, error);
    throw error;
  }

  return { mongoClient };
}

function configureApp(app: NestExpressApplication, configService: ApiConfigService) {
  // Security and performance middleware
  app.enable('trust proxy');
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Enable API versioning
  app.enableVersioning();

  // Configure global filters
  const reflector = app.get(Reflector);
  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
  );

  // Configure global interceptors
  app.useGlobalInterceptors(
    new TransformIdInterceptor(),
    new ClassSerializerInterceptor(reflector),
    new TranslationInterceptor(
      app.select(SharedModule).get(TranslationService),
    ),
  );

  // Configure global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  // Configure Swagger if enabled
  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  // Enable shutdown hooks in production
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }
}

async function setupMicroservices(app: NestExpressApplication, configService: ApiConfigService) {
  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        servers: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });
    await app.startAllMicroservices();
    console.log('✅ NATS microservices started');
  }
}

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();

  // Create NestJS application
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  // Get configuration service
  const configService = app.select(SharedModule).get(ApiConfigService);

  // Modify ObjectId prototype for MongoDB
  mongoose.Types.ObjectId.prototype.valueOf = function () {
    return this.toString();
  };

  // Configure application
  configureApp(app, configService);

  // Setup microservices
  await setupMicroservices(app, configService);

  // Initialize database connections
  
  try {
    // Start the application
    const port = configService.appConfig.port;
    await app.listen(port);
    console.log(`✅ Server running on ${await app.getUrl()}`);
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    throw error;
  }
  const { mongoClient } = await initializeDatabaseConnections(configService);
  await mongoClient.close();
  
  return app;
}

export const viteNodeApp = bootstrap();