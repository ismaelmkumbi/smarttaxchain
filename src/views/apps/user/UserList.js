// src/views/apps/user/UserList.js
import { Helmet } from 'react-helmet';
import { Box } from '@mui/material';
import UserList from 'src/components/apps/user/UserList';

const UserListPage = () => {
  return (
    <>
      <Helmet>
        <title>User Management | TRA Tax Chain</title>
      </Helmet>
      <Box>
        <UserList />
      </Box>
    </>
  );
};

export default UserListPage;

