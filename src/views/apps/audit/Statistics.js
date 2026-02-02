import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AuditStatistics from 'src/components/apps/audit/AuditStatistics';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Audit Statistics',
  },
];

const Statistics = () => {
  return (
    <PageContainer title="Audit Statistics" description="Comprehensive audit analytics">
      <Breadcrumb title="Audit Statistics" items={BCrumb} />
      <AuditStatistics />
    </PageContainer>
  );
};

export default Statistics;

