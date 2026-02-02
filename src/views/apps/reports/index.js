import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ReportsHub from 'src/components/apps/reports/ReportsHub';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Reports',
  },
];

const ReportsPage = () => {
  return (
    <PageContainer title="Reports" description="Generate and download various tax reports">
      <Breadcrumb title="Reports" items={BCrumb} />
      <ReportsHub />
    </PageContainer>
  );
};

export default ReportsPage;

