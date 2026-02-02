import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import HighRiskTransactions from 'src/components/apps/audit/HighRiskTransactions';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'High-Risk Transactions',
  },
];

const HighRisk = () => {
  return (
    <PageContainer title="High-Risk Transactions" description="Monitor and review high-risk transactions">
      <Breadcrumb title="High-Risk Transactions" items={BCrumb} />
      <HighRiskTransactions />
    </PageContainer>
  );
};

export default HighRisk;

