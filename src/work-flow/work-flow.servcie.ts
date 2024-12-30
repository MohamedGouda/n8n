import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class N8nService {
  private readonly n8nBaseUrl: string;
  private readonly apiKey: string;
  private readonly basicAuth: { username: string; password: string };

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.n8nBaseUrl = 'http://n8n:5678';

    this.apiKey = process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNGRkZDg0YS1lMzZmLTRhNWItYmRkNy0wOTdkNWRiOTQwMDUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzM1MjE3OTU5fQ.86LIaF4MKJnuhr4bJ4DZHkJbgPSzHXOE488-jxtLmiM';
    this.basicAuth = {
      username: process.env.N8N_BASIC_AUTH_USER || 'admin',
      password: process.env.N8N_BASIC_AUTH_PASSWORD || 'admin'
    };
  }

  private getHeaders() {
    const auth = Buffer.from(`${this.basicAuth.username}:${this.basicAuth.password}`).toString('base64');

    const headers = {
      'Content-Type': 'application/json',
     // 'Authorization': `Basic ${auth}`,
      "Accept": "application/json",
    };

    if (this.apiKey) {
      headers['X-N8N-API-KEY'] = this.apiKey;
    }

    console.log('Request URL:', this.n8nBaseUrl);
    console.log('Request Headers:', headers);
    return headers;
  }

  async createWorkflow(workflowDto: any) {
    const url = `${this.n8nBaseUrl}/api/v1/workflows`;

    try {
      console.log('Attempting to create workflow at:', url);
      const response = await lastValueFrom(
        this.httpService.post(url, workflowDto, {
          headers: this.getHeaders(),
          timeout: 5000 // 5 second timeout
        }),
      );
      console.log('Workflow creation successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Workflow creation failed:', {
        url,
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  async activateWorkflow(workflowId?: string) {
    const url = `${this.n8nBaseUrl}/api/v1/workflows/${workflowId}/activate`;

    try {
      console.log('Attempting to activate workflow at:', url);
      console.log(this.getHeaders())
      const response = await lastValueFrom(
        this.httpService.post(url, {}, {
          headers: this.getHeaders(),
          timeout: 5000 // 5 second timeout
        }),
      );
      console.log('Workflow activated successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Workflow activation failed:', {
        url,
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }


  async getWorkflows(workflowId?: string) {
    const url = workflowId
      ? `${this.n8nBaseUrl}/api/v1/workflows/${workflowId}`
      : `${this.n8nBaseUrl}/api/v1/workflows`;
    const response = await lastValueFrom(
      this.httpService.get(url, { headers: this.getHeaders() }),
    );
    return response.data;
  }

  async updateWorkflow(workflowId: string, workflowDto: any) {
    const url = `${this.n8nBaseUrl}/api/v1/workflows/${workflowId}`;
    const response = await lastValueFrom(
      this.httpService.put(url, workflowDto, { headers: this.getHeaders() }),
    );
    return response.data;
  }

  async deleteWorkflow(workflowId: string) {
    const url = `${this.n8nBaseUrl}/api/v1/workflows/${workflowId}`;
    const response = await lastValueFrom(
      this.httpService.delete(url, { headers: this.getHeaders() }),
    );
    return response.data;
  }

  async triggerWorkflow(workflowPath: string, payload: any) {
    const url = `${this.n8nBaseUrl}/api/v1/workflows/trigger/${workflowPath}`;
    const response = await lastValueFrom(
      this.httpService.post(url, payload, { headers: this.getHeaders() }),
    );
    return response.data;
  }

  async executeWorkflowManually(workflowId: string, payload: any) {
    try {
      const url = `${this.n8nBaseUrl}/rest/workflows/${workflowId}/run`;
      
      // Use only the API key header, remove basic auth
      const response = await lastValueFrom(
        this.httpService.post(url, {}, { headers: this.getHeaders() }),
      );
      
      return response.data;
    } catch (err) {

      console.log(err)
      // if (err.response?.status === 401) {
      //   console.error('Authentication failed:', err.response?.data);
      // }
      throw err;
    }
  }

  async getExecutionResult(executionId: string) {
    const url = `${this.n8nBaseUrl}/api/v1/executions/${executionId}`;
    const response = await lastValueFrom(
      this.httpService.get(url, { headers: this.getHeaders() }),
    );
    return response.data;
  }
}