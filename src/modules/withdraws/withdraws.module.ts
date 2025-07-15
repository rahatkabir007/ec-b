import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WithdrawsService } from './withdraws.service';
import { WithdrawsController } from './withdraws.controller';
import { Withdraw, WithdrawSchema } from '../../schemas/withdraw.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Withdraw.name, schema: WithdrawSchema }]),
  ],
  controllers: [WithdrawsController],
  providers: [WithdrawsService]
})
export class WithdrawsModule { }
