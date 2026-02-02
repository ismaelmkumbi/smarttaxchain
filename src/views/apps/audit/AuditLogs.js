import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AuditLogsViewer from 'src/components/apps/audit/AuditLogsViewer';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Audit Logs',
  },
];

const AuditLogs = () => {
  return (
    <PageContainer title="Audit Logs" description="Enterprise audit logs viewer">
      <Breadcrumb title="Audit Logs" items={BCrumb} />
      <AuditLogsViewer />
    </PageContainer>
  );
};

export default AuditLogs;

