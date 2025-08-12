'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Building,
  Calendar,
  Clock,
  CreditCard,
  Download,
  FileDown,
  FileText,
  Mail,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';

import type {
  GeneratedReport,
  GenerateParams,
  ReportsDashboardProps,
  ReportStats,
  ReportTemplate,
} from './ReportsDashboard.interfaces';

import * as S from './ReportsDashboard.styled';

export const ReportsDashboard = ({ className }: ReportsDashboardProps) => {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    averageGenerationTime: 0,
    pendingReports: 0,
    reportsThisMonth: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateParams, setGenerateParams] = useState<GenerateParams>({
    dateFrom: '',
    dateTo: '',
    format: 'PDF',
    includeDetails: true,
    venueIds: [],
  });

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      defaultParams: {
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
      },
      description: 'Reporte detallado de ingresos, métodos de pago, y tendencias financieras',
      estimatedTime: '2-3 min',
      icon: CreditCard,
      id: '1',
      name: 'Análisis de Ingresos',
      type: 'REVENUE_ANALYSIS',
    },
    {
      defaultParams: {
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
      },
      description: 'Estados de reservaciones, tasas de confirmación, y patrones de reserva',
      estimatedTime: '1-2 min',
      icon: Calendar,
      id: '2',
      name: 'Resumen de Reservaciones',
      type: 'RESERVATIONS_SUMMARY',
    },
    {
      defaultParams: {
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
      },
      description: 'Registro de usuarios, actividad, segmentación y comportamiento',
      estimatedTime: '2-3 min',
      icon: Users,
      id: '3',
      name: 'Actividad de Usuarios',
      type: 'USER_ACTIVITY',
    },
    {
      defaultParams: {
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
      },
      description: 'Comparación de venues, ocupación, servicios más populares',
      estimatedTime: '2-4 min',
      icon: Building,
      id: '4',
      name: 'Rendimiento de Venues',
      type: 'VENUE_PERFORMANCE',
    },
  ];

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockReports: GeneratedReport[] = [
        {
          fileUrl: '/api/reports/1/download',
          format: 'PDF',
          generatedAt: '2025-01-10T10:30:00Z',
          generatedBy: 'Admin User',
          id: '1',
          name: 'Análisis de Ingresos - Enero 2025',
          size: '2.3 MB',
          status: 'COMPLETED',
          type: 'REVENUE_ANALYSIS',
        },
        {
          fileUrl: '/api/reports/2/download',
          format: 'EXCEL',
          generatedAt: '2025-01-08T14:15:00Z',
          generatedBy: 'Manager User',
          id: '2',
          name: 'Resumen de Reservaciones - Diciembre 2024',
          size: '1.8 MB',
          status: 'COMPLETED',
          type: 'RESERVATIONS_SUMMARY',
        },
        {
          format: 'PDF',
          generatedAt: '2025-01-10T11:00:00Z',
          generatedBy: 'Admin User',
          id: '3',
          name: 'Actividad de Usuarios - Últimos 30 días',
          status: 'GENERATING',
          type: 'USER_ACTIVITY',
        },
      ];

      setReports(mockReports);
      setStats({
        averageGenerationTime: 180,
        pendingReports: 1,
        reportsThisMonth: 8,
        totalReports: 15,
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);

      // Mock report generation
      const newReport: GeneratedReport = {
        format: generateParams.format,
        generatedAt: new Date().toISOString(),
        generatedBy: 'Current User',
        id: Date.now().toString(),
        name: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
        status: 'GENERATING',
        type: selectedTemplate.type,
      };

      setReports((prev) => [newReport, ...prev]);
      setShowGenerateModal(false);

      // Simulate report completion after 3 seconds
      setTimeout(() => {
        setReports((prev) =>
          prev.map((r) =>
            r.id === newReport.id
              ? {
                  ...r,
                  fileUrl: `/api/reports/${newReport.id}/download`,
                  size: '2.1 MB',
                  status: 'COMPLETED' as const,
                }
              : r
          )
        );
      }, 3000);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <FileDown />;
      case 'GENERATING':
        return <RefreshCw />;
      case 'PENDING':
        return <Clock />;
      case 'FAILED':
        return <FileText />;
      default:
        return <FileText />;
    }
  };

  const handleSelectTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setGenerateParams({
      ...generateParams,
      ...template.defaultParams,
    });
    setShowGenerateModal(true);
  };

  const handleCloseModal = () => {
    setShowGenerateModal(false);
    setSelectedTemplate(null);
  };

  const handleDownloadReport = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <S.DashboardContainer className={className}>
      <S.HeaderSection>
        <S.HeaderTitle>Reportes Empresariales</S.HeaderTitle>
        <S.RefreshButton onClick={fetchReports}>
          <RefreshCw />
          Actualizar
        </S.RefreshButton>
      </S.HeaderSection>

      {/* Stats Cards */}
      <S.StatsGrid>
        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#2563eb'>
              <FileText />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Total Reportes</S.StatLabel>
              <S.StatValue>{stats.totalReports}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#059669'>
              <TrendingUp />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Este Mes</S.StatLabel>
              <S.StatValue>{stats.reportsThisMonth}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#d97706'>
              <Clock />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Pendientes</S.StatLabel>
              <S.StatValue>{stats.pendingReports}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#7c3aed'>
              <RefreshCw />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Tiempo Promedio</S.StatLabel>
              <S.StatValue>{Math.round(stats.averageGenerationTime / 60)}m</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      {/* Report Templates */}
      <S.TemplatesSection>
        <S.TemplatesTitle>Generar Nuevo Reporte</S.TemplatesTitle>
        <S.TemplatesGrid>
          {reportTemplates.map((template) => (
            <S.TemplateCard key={template.id} onClick={() => handleSelectTemplate(template)}>
              <S.TemplateHeader>
                <S.TemplateIcon>
                  <template.icon />
                </S.TemplateIcon>
                <S.TemplateName>{template.name}</S.TemplateName>
              </S.TemplateHeader>
              <S.TemplateDescription>{template.description}</S.TemplateDescription>
              <S.TemplateFooter>
                <S.TemplateTime>⏱️ {template.estimatedTime}</S.TemplateTime>
                <S.TemplateButton>Generar</S.TemplateButton>
              </S.TemplateFooter>
            </S.TemplateCard>
          ))}
        </S.TemplatesGrid>
      </S.TemplatesSection>

      {/* Recent Reports */}
      <S.ReportsSection>
        <S.ReportsHeader>
          <S.ReportsTitle>Reportes Recientes</S.ReportsTitle>
        </S.ReportsHeader>

        <S.TableContainer>
          <S.Table>
            <S.TableHeader>
              <S.TableHeaderRow>
                <S.TableHeaderCell>Reporte</S.TableHeaderCell>
                <S.TableHeaderCell>Estado</S.TableHeaderCell>
                <S.TableHeaderCell>Generado</S.TableHeaderCell>
                <S.TableHeaderCell>Formato</S.TableHeaderCell>
                <S.TableHeaderCell>Tamaño</S.TableHeaderCell>
                <S.TableHeaderCell>Acciones</S.TableHeaderCell>
              </S.TableHeaderRow>
            </S.TableHeader>
            <S.TableBody>
              {reports.map((report) => (
                <S.TableRow key={report.id}>
                  <S.TableCell>
                    <S.ReportInfo>
                      <S.ReportIcon>
                        <FileText />
                      </S.ReportIcon>
                      <S.ReportDetails>
                        <S.ReportName>{report.name}</S.ReportName>
                        <S.ReportAuthor>por {report.generatedBy}</S.ReportAuthor>
                      </S.ReportDetails>
                    </S.ReportInfo>
                  </S.TableCell>

                  <S.TableCell>
                    <S.StatusBadge $status={report?.status}>
                      {getStatusIcon(report?.status)}
                      {report?.status}
                    </S.StatusBadge>
                  </S.TableCell>

                  <S.DateCell>
                    {new Date(report.generatedAt).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </S.DateCell>

                  <S.TableCell>
                    <S.FormatBadge>{report.format}</S.FormatBadge>
                  </S.TableCell>

                  <S.SizeCell>{report.size || '-'}</S.SizeCell>

                  <S.ActionsCell>
                    <S.ActionsContainer>
                      {report?.status === 'COMPLETED' && report.fileUrl && (
                        <S.ActionButton
                          variant='primary'
                          onClick={() => handleDownloadReport(report.fileUrl)}
                        >
                          <Download />
                          Descargar
                        </S.ActionButton>
                      )}

                      {report?.status === 'COMPLETED' && (
                        <S.ActionButton variant='secondary'>
                          <Mail />
                          Enviar
                        </S.ActionButton>
                      )}
                    </S.ActionsContainer>
                  </S.ActionsCell>
                </S.TableRow>
              ))}
            </S.TableBody>
          </S.Table>
        </S.TableContainer>
      </S.ReportsSection>

      {/* Generate Report Modal */}
      {showGenerateModal && selectedTemplate && (
        <S.ModalOverlay>
          <S.ModalContainer>
            <S.ModalContent>
              <S.ModalTitle>Generar {selectedTemplate.name}</S.ModalTitle>

              <S.ModalForm>
                <S.FormField>
                  <S.FormLabel>Fecha Desde</S.FormLabel>
                  <S.FormInput
                    type='date'
                    value={generateParams.dateFrom}
                    onChange={(e) =>
                      setGenerateParams({ ...generateParams, dateFrom: e.target.value })
                    }
                  />
                </S.FormField>

                <S.FormField>
                  <S.FormLabel>Fecha Hasta</S.FormLabel>
                  <S.FormInput
                    type='date'
                    value={generateParams.dateTo}
                    onChange={(e) =>
                      setGenerateParams({ ...generateParams, dateTo: e.target.value })
                    }
                  />
                </S.FormField>

                <S.FormField>
                  <S.FormLabel>Formato</S.FormLabel>
                  <S.FormSelect
                    value={generateParams.format}
                    onChange={(e) =>
                      setGenerateParams({
                        ...generateParams,
                        format: e.target.value as 'PDF' | 'EXCEL' | 'CSV',
                      })
                    }
                  >
                    <option value='PDF'>PDF</option>
                    <option value='EXCEL'>Excel</option>
                    <option value='CSV'>CSV</option>
                  </S.FormSelect>
                </S.FormField>

                <S.CheckboxField>
                  <S.CheckboxInput
                    checked={generateParams.includeDetails}
                    type='checkbox'
                    onChange={(e) =>
                      setGenerateParams({ ...generateParams, includeDetails: e.target.checked })
                    }
                  />
                  <S.CheckboxLabel>Incluir detalles completos</S.CheckboxLabel>
                </S.CheckboxField>
              </S.ModalForm>

              <S.ModalActions>
                <S.ModalButton variant='secondary' onClick={handleCloseModal}>
                  Cancelar
                </S.ModalButton>
                <S.ModalButton disabled={loading} variant='primary' onClick={handleGenerateReport}>
                  {loading ? 'Generando...' : 'Generar Reporte'}
                </S.ModalButton>
              </S.ModalActions>
            </S.ModalContent>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}
    </S.DashboardContainer>
  );
};
