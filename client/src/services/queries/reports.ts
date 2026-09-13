import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '@/services/api/reports';
import type { CreateReportInput, WasteReport } from '@/types/reports';

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

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReportInput) =>
      reportsService.createReport(payload),
    onSuccess: (report: WasteReport) => {
      void queryClient.invalidateQueries({ queryKey: ['reports', 'my'] });
      void queryClient.invalidateQueries({ queryKey: ['reports', 'my', 'summary'] });
      void queryClient.invalidateQueries({ queryKey: ['reports', report.id] });
    },
  });
}

export function useCancelReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportsService.cancelReport(id),
    onSuccess: (report: WasteReport) => {
      void queryClient.invalidateQueries({ queryKey: ['reports', report.id] });
      void queryClient.invalidateQueries({ queryKey: ['reports', 'my'] });
      void queryClient.invalidateQueries({ queryKey: ['reports', 'my', 'summary'] });
    },
  });
}
