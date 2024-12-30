import { Controller, Post, Get, Patch, Delete, Param, Body, Query, Put } from '@nestjs/common';
import { N8nService } from './work-flow.servcie';

@Controller('n8n')
export class N8nController {
  constructor(private readonly n8nService: N8nService) { }

  @Post('workflows')
  async createWorkflow(@Body() workflowDto: any) {
    return this.n8nService.createWorkflow(workflowDto);
  }

  @Post('workflows/:id/activate')
  async activateWorkflow(@Param('id') workflowId?: string) {
    return this.n8nService.activateWorkflow(workflowId);
  }

  @Get('workflows')
  async getWorkflows(@Query('id') workflowId?: string) {
    return this.n8nService.getWorkflows(workflowId);
  }

  @Put('workflows/:workflowId')
  async updateWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() workflowDto: any,
  ) {
    return this.n8nService.updateWorkflow(workflowId, workflowDto);
  }

  @Delete('workflows/:workflowId')
  async deleteWorkflow(@Param('workflowId') workflowId: string) {
    return this.n8nService.deleteWorkflow(workflowId);
  }

  /** WORKFLOW EXECUTION FEATURES **/

  // Trigger a workflow via webhook
  @Post('trigger/:workflowPath')
  async triggerWorkflow(
    @Param('workflowPath') workflowPath: string,
    @Body() payload: any,
  ) {
    return this.n8nService.triggerWorkflow(workflowPath, payload);
  }

  // Execute a workflow manually
  @Post('execute/:workflowId')
  async executeWorkflowManually(
    @Param('workflowId') workflowId: string,
    @Body() payload: any,
  ) {
    return this.n8nService.executeWorkflowManually(workflowId, payload);
  }

  // Get the execution result of a workflow
  @Get('execution/:executionId')
  async getExecutionResult(@Param('executionId') executionId: string) {
    return this.n8nService.getExecutionResult(executionId);
  }
}