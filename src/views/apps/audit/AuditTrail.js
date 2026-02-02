import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AuditTrailViewer from 'src/components/apps/audit/AuditTrailViewer';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/apps/audit/logs',
    title: 'Audit Logs',
  },
  {
    title: 'Audit Trail',
  },
];

const AuditTrail = () => {
  return (
    <PageContainer title="Audit Trail" description="Complete audit trail for entity">
      <Breadcrumb title="Audit Trail" items={BCrumb} />
      <AuditTrailViewer />
    </PageContainer>
  );
};

export default AuditTrail;

