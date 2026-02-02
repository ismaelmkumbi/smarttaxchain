import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import TaxTypeManagement from 'src/components/apps/system/TaxTypeManagement';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/system',
    title: 'System Management',
  },
  {
    title: 'Tax Type Management',
  },
];

const TaxTypeManagementPage = () => {
  return (
    <PageContainer title="Tax Type Management" description="Manage tax types used in assessments">
      <Breadcrumb title="Tax Type Management" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <TaxTypeManagement />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default TaxTypeManagementPage;

