import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import UserActivityMonitor from 'src/components/apps/audit/UserActivityMonitor';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/apps/audit/logs',
    title: 'Audit Logs',
  },
  {
    title: 'User Activity',
  },
];

const UserActivity = () => {
  return (
    <PageContainer title="User Activity Monitor" description="Monitor user activity and behavior">
      <Breadcrumb title="User Activity" items={BCrumb} />
      <UserActivityMonitor />
    </PageContainer>
  );
};

export default UserActivity;

