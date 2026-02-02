import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import InvoiceList from 'src/components/apps/invoice/Invoice-list/index';
import AssessmentList from 'src/components/apps/assessment/Assessment-list/index';
import { InvoiceProvider } from 'src/context/InvoiceContext/index';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import { Assessment } from '@mui/icons-material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Tax Assessment List',
  },
];

const TaxAssessmentList = () => {
  return (
    <InvoiceProvider>
      <PageContainer title="Tax Assessment" description="this is Invoice List">
        <Breadcrumb title="Tax Assessment List" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <AssessmentList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </InvoiceProvider>
  );
};
export default TaxAssessmentList;
