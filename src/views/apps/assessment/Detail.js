import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import AssessmentDetail from 'src/components/apps/assessment/AssessmentDetail';

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
    title: 'Assessment Details',
  },
];

const AssessmentDetailPage = () => {
  return (
    <PageContainer title="Assessment Detail" description="View assessment details">
      <Breadcrumb title="Assessment Details" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <AssessmentDetail />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default AssessmentDetailPage;
