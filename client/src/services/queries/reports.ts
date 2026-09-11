import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/api/reports';

export function useMyReports() {
  return useQuery({
    queryKey: ['reports', 'my'],
    queryFn: () => reportsService.getMyReports(),
  });
}

export function useReportSummary() {
  return useQuery({
    queryKey: ['reports', 'my', 'summary'],
    queryFn: () => reportsService.getReportSummary(),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportsService.getReportById(id),
    enabled: !!id,
  });
}
