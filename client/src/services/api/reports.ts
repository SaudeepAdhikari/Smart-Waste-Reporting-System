import { apiClient } from './client';
import type {
  CreateReportPayload,
  Report,
  ReportSummary,
} from '@/types/reports';
import type { PaginatedResponse } from '@/types/api';

export class ReportsService {
  async getMyReports(): Promise<Report[]> {
    const response = await apiClient.get<PaginatedResponse<Report>>(
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

  async getReportById(id: string): Promise<Report> {
    const response = await apiClient.get<Report>(
      `/api/v1/reports/${encodeURIComponent(id)}`
    );
    return response;
  }

  /**
   * Submit a citizen waste report.
   * Endpoint: POST /api/v1/reports
   *
   * Image binary upload is intentionally deferred. When cloud storage is ready,
   * upload images first, then include resulting URLs in a follow-up payload shape.
   */
  async submitReport(payload: CreateReportPayload): Promise<Report> {
    return apiClient.post<Report>('/api/v1/reports', payload);
  }
}

export const reportsService = new ReportsService();
