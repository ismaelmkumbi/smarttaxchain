import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AuditLogManagement from 'src/components/apps/audit/AuditLogManagement';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/system/settings',
    title: 'System Settings',
  },
  {
    title: 'Log Management',
  },
];

const LogManagement = () => {
  return (
    <PageContainer title="Log Management" description="Archive and delete audit logs">
      <Breadcrumb title="Log Management" items={BCrumb} />
      <AuditLogManagement />
    </PageContainer>
  );
};

export default LogManagement;

