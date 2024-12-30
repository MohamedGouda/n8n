import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { N8nController } from './work-flow.controller';
import { N8nService } from './work-flow.servcie';

@Module({
    imports: [HttpModule],
  controllers: [N8nController],
  providers: [N8nService],
})
export class WorkFlowModule {}
