import { Global, Module } from '@nestjs/common';
import { Token, TokenSchema } from './token.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}])],
  // exports: [TokenService],
  // providers: [TokenService],
})
export class TokenModule {}