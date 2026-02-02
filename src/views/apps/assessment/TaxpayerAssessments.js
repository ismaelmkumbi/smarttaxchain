import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import TaxpayerAssessments from 'src/components/apps/assessment/TaxpayerAssessments';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/apps/assessment/list',
    title: 'Assessments',
  },
  {
    title: 'Taxpayer Assessments',
  },
];

const TaxpayerAssessmentsPage = () => {
  return (
    <PageContainer title="Taxpayer Assessments" description="View all assessments for a taxpayer">
      <Breadcrumb title="Taxpayer Assessments" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <TaxpayerAssessments />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default TaxpayerAssessmentsPage;

