import { apiClient } from './client';
import type { PaginatedResponse } from '@/types/api';

export type NotificationType =
  | 'REPORT_VERIFIED'
  | 'REPORT_REJECTED'
  | 'COLLECTION_SCHEDULED'
  | 'COLLECTION_COMPLETED'
  | 'SYSTEM_UPDATE';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export class NotificationsService {
  async getNotifications(limit = 5): Promise<Notification[]> {
    const response = await apiClient.get<PaginatedResponse<Notification>>(`/api/v1/notifications?page=1&limit=${limit}`);
    return response.items;
  }
}

export const notificationsService = new NotificationsService();
