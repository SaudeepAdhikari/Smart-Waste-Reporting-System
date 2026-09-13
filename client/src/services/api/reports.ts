import { apiClient } from './client';
import type {
  CreateReportPayload,
  WasteReport,
  ReportSummary,
} from '@/types/reports';
import type { PaginatedResponse } from '@/types/api';

export class ReportsService {
  async getMyReports(): Promise<WasteReport[]> {
    const response = await apiClient.get<PaginatedResponse<WasteReport>>(
      '/api/v1/reports/my?page=1&limit=20'
    );
    return response.items;
  }

  async getReportSummary(): Promise<ReportSummary> {
    const response = await apiClient.get<ReportSummary>(
      '/api/v1/reports/my/summary'
    );
    return response;
  }

  async getReportById(id: string): Promise<WasteReport> {
    const response = await apiClient.get<WasteReport>(
      `/api/v1/reports/${encodeURIComponent(id)}`
    );
    return response;
  }

  async createReport(payload: CreateReportPayload): Promise<WasteReport> {
    return apiClient.post<WasteReport>('/api/v1/reports', payload);
  }

  async cancelReport(id: string): Promise<WasteReport> {
    return apiClient.patch<WasteReport>(
      `/api/v1/reports/${encodeURIComponent(id)}/cancel`
    );
  }
}

export const reportsService = new ReportsService();
