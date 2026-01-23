import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionHelper } from './transaction.helper';

@Global()
@Module({
  providers: [PrismaService, TransactionHelper],
  exports: [PrismaService, TransactionHelper],
})
export class DatabaseModule { }
