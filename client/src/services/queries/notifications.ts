import { useQuery } from '@tanstack/react-query';
import { notificationsService } from '@/services/api/notifications';

export function useNotifications(limit = 5) {
  return useQuery({
    queryKey: ['notifications', limit],
    queryFn: () => notificationsService.getNotifications(limit),
  });
}
