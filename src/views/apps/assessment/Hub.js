import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import AssessmentHub from 'src/components/apps/assessment/AssessmentHub';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Tax Assessment',
  },
];

const AssessmentHubPage = () => {
  return (
    <PageContainer title="Tax Assessment" description="Tax Assessment Management Hub">
      <Breadcrumb title="Tax Assessment" items={BCrumb} />
      <AssessmentHub />
    </PageContainer>
  );
};

export default AssessmentHubPage;

