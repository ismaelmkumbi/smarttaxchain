// src/views/apps/system/users/SystemUsers.js
import { Helmet } from 'react-helmet';
import { Box } from '@mui/material';
import UserList from 'src/components/apps/user/UserList';

const SystemUsersPage = () => {
  return (
    <>
      <Helmet>
        <title>System Users | TRA Tax Chain</title>
      </Helmet>
      <Box>
        <UserList />
      </Box>
    </>
  );
};

export default SystemUsersPage;

