import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import TaxpayerSearch from 'src/components/apps/assessment/TaxpayerSearch';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Tax Assessment',
  },
  {
    title: 'By Taxpayer',
  },
];

const TaxpayerSearchPage = () => {
  return (
    <PageContainer title="Taxpayer Assessments" description="Search and view assessments by taxpayer">
      <Breadcrumb title="By Taxpayer" items={BCrumb} />
      <TaxpayerSearch />
    </PageContainer>
  );
};

export default TaxpayerSearchPage;

