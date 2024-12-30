import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkFlowModule } from './work-flow/work-flow.module';

@Module({
  imports: [WorkFlowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
