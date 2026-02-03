import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { InvoiceProvider } from 'src/context/InvoiceContext/index';
import { AuditProvider } from '../../../context/AuditContext/AuditContext';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import AuditingList from '../../../components/apps/auditing/Invoice-list';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Auditing List',
  },
];

const Auditing = () => {
  return (
    <AuditProvider>
      <PageContainer title="Auditing List" description="this is Invoice List">
        <Breadcrumb title="Auditing List" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <AuditingList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </AuditProvider>
  );
};
export default Auditing;
