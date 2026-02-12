import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AssessmentAccountView from 'src/components/apps/assessment/AssessmentAccountView';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/apps/assessment/list', title: 'Assessments' },
  { title: 'Account & Payments' },
];

const AssessmentAccountPage = () => (
  <PageContainer title="Assessment Account" description="View assessment account and payment entries">
    <Breadcrumb title="Assessment Account" items={BCrumb} />
    <AssessmentAccountView />
  </PageContainer>
);

export default AssessmentAccountPage;
