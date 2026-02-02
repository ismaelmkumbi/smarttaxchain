import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import TaxpayerComplianceReport from 'src/components/apps/compliance/TaxpayerComplianceReport';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Taxpayer Compliance Report',
  },
];

const TaxpayerComplianceReportPage = () => {
  return (
    <PageContainer title="Taxpayer Compliance Report" description="Generate comprehensive compliance reports">
      <Breadcrumb title="Taxpayer Compliance Report" items={BCrumb} />
      <TaxpayerComplianceReport />
    </PageContainer>
  );
};

export default TaxpayerComplianceReportPage;

