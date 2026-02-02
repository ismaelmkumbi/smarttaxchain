// src/components/apps/user/UserList/index.js
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Snackbar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search,
  Person,
  Add,
  FilterList,
  Edit,
  Delete,
  Visibility,
  Refresh,
  CheckCircle,
  Cancel,
  VerifiedUser,
  Warning,
  Block,
  CheckCircleOutline,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import userManagementService from 'src/services/userManagementService';
import { register } from 'src/services/authService';
import { Fade, Grow } from '@mui/material';

// Role color mapping
const getRoleColor = (role, theme) => {
  const roleMap = {
    admin: { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main },
    officer: { bg: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main },
    auditor: { bg: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main },
    manager: { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main },
  };
  return roleMap[role] || { bg: alpha(theme.palette.grey[500], 0.1), color: theme.palette.grey[600] };
};

// Stats Card Component
const StatsCard = ({ icon, title, value, color, onClick }) => {
  const theme = useTheme();

  const getCardColor = () => {
    if (color === 'primary') {
      return {
        border: theme.palette.primary.main, // TRA Yellow
        bg: alpha(theme.palette.primary.main, 0.1),
        text: theme.palette.secondary.main, // TRA Black
        avatar: theme.palette.primary.main, // TRA Yellow
        avatarText: theme.palette.secondary.main, // Black text on yellow
      };
    }
    return {
      border: theme.palette[color].main,
      bg: alpha(theme.palette[color].main, 0.1),
      text: theme.palette[color].dark,
      avatar: theme.palette[color].main,
      avatarText: 'white',
    };
  };

  const cardColor = getCardColor();

  return (
    <Grow in={true} timeout={600}>
      <Card
        sx={{
          p: 3,
          bgcolor: 'white',
          border: `2px solid ${alpha(cardColor.border, 0.3)}`,
          borderTop: `4px solid ${cardColor.border}`,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          } : {},
        }}
        onClick={onClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: cardColor.avatar,
              color: cardColor.avatarText,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color={cardColor.text}>
              {value}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Grow>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  onClick: PropTypes.func,
};

const UserList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
  });

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    department: '',
    isActive: '',
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [verificationDialog, setVerificationDialog] = useState({ open: false, user: null, result: null });
  const [verifying, setVerifying] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    role: 'officer',
    department: '',
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'officer',
    department: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters.role, filters.department, filters.isActive]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if user has a token
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please log in to view users.');
        setLoading(false);
        return;
      }

      const queryFilters = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      if (filters.role) queryFilters.role = filters.role;
      if (filters.department) queryFilters.department = filters.department;
      if (filters.isActive !== '') queryFilters.isActive = filters.isActive === 'true';

      console.log('Loading users with filters:', queryFilters);
      const response = await userManagementService.getAllUsers(queryFilters);
      let userList = Array.isArray(response?.users) ? response.users : [];

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        userList = userList.filter(
          (user) =>
            user?.username?.toLowerCase().includes(searchLower) ||
            user?.email?.toLowerCase().includes(searchLower) ||
            user?.staffId?.toLowerCase().includes(searchLower) ||
            user?.department?.toLowerCase().includes(searchLower)
        );
      }

      setUsers(userList);
      setTotalCount(response?.pagination?.total || userList.length || 0);

      // Calculate stats
      const allUsers = Array.isArray(response?.users) ? response.users : [];
      setStats({
        total: response?.pagination?.total || allUsers.length || 0,
        active: allUsers.filter((u) => u?.is_active).length,
        inactive: allUsers.filter((u) => !u?.is_active).length,
        admins: allUsers.filter((u) => u?.role === 'admin').length,
      });
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err?.message || err?.error || 'Failed to load users. Please check your authentication.');
      setUsers([]);
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        admins: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewUser = async (user) => {
    try {
      // Backend accepts email in :username parameter
      const email = user.email || user.username;
      const fullUser = await userManagementService.getUserByUsername(email);
      setSelectedUser(fullUser);
      setViewDialogOpen(true);
    } catch (err) {
      console.error('Error loading user details:', err);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || user.username || '',
      email: user.email || '',
      role: user.role || 'officer',
      department: user.department || '',
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
    setEditFormErrors({});
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    // Validate form
    const errors = {};
    if (!editFormData.name) errors.name = 'Name is required';
    if (!editFormData.email) errors.email = 'Email is required';
    if (editFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!editFormData.role) errors.role = 'Role is required';
    if (!editFormData.department) errors.department = 'Department is required';

    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    setUpdatingUser(true);
    try {
      // Backend accepts email in :username parameter
      const email = selectedUser.email || selectedUser.username;
      if (!email) {
        throw new Error('Email not found');
      }
      
      const result = await userManagementService.updateUser(email, {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        department: editFormData.department,
        is_active: editFormData.is_active,
      });
      
      // Extract user info from response
      const userData = result?.data || result;
      const userName = userData?.name || editFormData.name;
      const userEmail = userData?.email || editFormData.email;
      
      // Show success notification
      setSnackbar({
        open: true,
        message: `User "${userName}" (${userEmail}) updated successfully!`,
        severity: 'success',
      });
      
      setEditDialogOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage = 
        err?.response?.data?.error || 
        err?.response?.data?.message || 
        err?.message || 
        'Failed to update user';
      setEditFormErrors({ submit: errorMessage });
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleActivateUser = async (user) => {
    setActionLoading(true);
    try {
      // Backend accepts email in :username parameter
      const email = user.email || user.username;
      if (!email) {
        throw new Error('Email not found');
      }
      await userManagementService.activateUser(email);
      await loadUsers();
    } catch (err) {
      console.error('Error activating user:', err);
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to activate user';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateUser = async (user) => {
    setActionLoading(true);
    try {
      // Backend accepts email in :username parameter
      const email = user.email || user.username;
      if (!email) {
        throw new Error('Email not found');
      }
      await userManagementService.deactivateUser(email);
      await loadUsers();
    } catch (err) {
      console.error('Error deactivating user:', err);
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to deactivate user';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      // Backend accepts email in :username parameter
      const email = selectedUser.email || selectedUser.username;
      if (!email) {
        throw new Error('Email not found');
      }
      await userManagementService.deleteUser(email);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to delete user';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyUser = async (user) => {
    setVerifying(true);
    setVerificationDialog({ open: true, user, result: null });
    try {
      // Backend accepts email in :username parameter
      const email = user.email || user.username;
      const result = await userManagementService.verifyUser(email);
      setVerificationDialog({ open: true, user, result });
    } catch (err) {
      console.error('Error verifying user:', err);
      setVerificationDialog({
        open: true,
        user,
        result: {
          verified: false,
          error: err?.response?.data?.message || err?.message || 'Verification failed',
        },
      });
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      department: '',
      isActive: '',
    });
    setPage(0);
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading users...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage staff accounts and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadUsers}
            disabled={loading}
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              fontWeight: 600,
              '&:hover': {
                borderColor: theme.palette.secondary.dark,
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
              },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setFormData({
                name: '',
                username: '',
                password: '',
                email: '',
                role: 'officer',
                department: '',
              });
              setFormErrors({});
              setCreateDialogOpen(true);
            }}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
              fontWeight: 600,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            New User
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<Person />}
            title="Total Users"
            value={stats.total}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<CheckCircle />}
            title="Active Users"
            value={stats.active}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<Cancel />}
            title="Inactive Users"
            value={stats.inactive}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<VerifiedUser />}
            title="Administrators"
            value={stats.admins}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Fade in={true} timeout={600}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FilterList color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Button size="small" onClick={clearFilters}>
              Clear
            </Button>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Role"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="officer">Officer</MenuItem>
                <MenuItem value="auditor">Auditor</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Department"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="Administration">Administration</MenuItem>
                <MenuItem value="Tax Collection">Tax Collection</MenuItem>
                <MenuItem value="Compliance">Compliance</MenuItem>
                <MenuItem value="Audit">Audit</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filters.isActive}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <Fade in={true} timeout={800}>
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                }}
              >
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Department</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Last Login</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Person sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No users found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Object.values(filters).some((f) => f) ? 'Try adjusting your filters' : 'No users available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const roleColor = getRoleColor(user.role, theme);

                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.secondary.main }}>
                            {(user.name || user.username)?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {user.name || user.username || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {user.email || 'N/A'}
                            </Typography>
                            {user.staffId && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                Staff ID: {user.staffId}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role?.toUpperCase() || 'N/A'}
                          size="small"
                          sx={{
                            bgcolor: roleColor.bg,
                            color: roleColor.color,
                            fontWeight: 600,
                            border: `1px solid ${alpha(roleColor.color, 0.3)}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.department || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={user.is_active ? <CheckCircleOutline /> : <Block />}
                          label={user.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            bgcolor: user.is_active
                              ? alpha(theme.palette.success.main, 0.1)
                              : alpha(theme.palette.error.main, 0.1),
                            color: user.is_active ? theme.palette.success.main : theme.palette.error.main,
                            fontWeight: 600,
                            border: `1px solid ${alpha(
                              user.is_active ? theme.palette.success.main : theme.palette.error.main,
                              0.3
                            )}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(user.last_login)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewUser(user)}
                              sx={{
                                color: theme.palette.secondary.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                },
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {user.staffId && (
                            <Tooltip title="Verify Integrity">
                              <IconButton
                                size="small"
                                onClick={() => handleVerifyUser(user)}
                                disabled={verifying}
                                sx={{
                                  color: theme.palette.info.main,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                  },
                                }}
                              >
                                <Security fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditUser(user)}
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {user.is_active ? (
                            <Tooltip title="Deactivate">
                              <IconButton
                                size="small"
                                onClick={() => handleDeactivateUser(user)}
                                disabled={actionLoading}
                                sx={{
                                  color: theme.palette.warning.main,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                  },
                                }}
                              >
                                <Block fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Activate">
                              <IconButton
                                size="small"
                                onClick={() => handleActivateUser(user)}
                                disabled={actionLoading}
                                sx={{
                                  color: theme.palette.success.main,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                  },
                                }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteUser(user)}
                              sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </TableContainer>
      </Fade>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person color="primary" />
            <Typography variant="h6" component="span">User Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: theme.palette.primary.main, color: theme.palette.secondary.main }}>
                    {(selectedUser.name || selectedUser.username)?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {selectedUser.name || selectedUser.username || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{selectedUser.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedUser.name || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Email (Username)
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedUser.email || selectedUser.username || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Staff ID
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedUser.staffId || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedUser.role?.toUpperCase() || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedUser.department || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  icon={selectedUser.is_active ? <CheckCircleOutline /> : <Block />}
                  label={selectedUser.is_active ? 'Active' : 'Inactive'}
                  size="small"
                  sx={{
                    bgcolor: selectedUser.is_active
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1),
                    color: selectedUser.is_active ? theme.palette.success.main : theme.palette.error.main,
                    fontWeight: 600,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Last Login
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatDate(selectedUser.last_login)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatDate(selectedUser.created_at)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setViewDialogOpen(false)}
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<VerifiedUser />}
            onClick={() => {
              setViewDialogOpen(false);
              navigate(`/apps/user/verify/${selectedUser?.username}`);
            }}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Verify Integrity
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Add color="primary" />
            <Typography variant="h6" component="span">Create New User</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                error={!!formErrors.email}
                helperText={formErrors.email || 'Email will be used as username automatically'}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={!!formErrors.password}
                helperText={formErrors.password || 'Minimum 8 characters required'}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                error={!!formErrors.role}
                helperText={formErrors.role}
                required
                variant="outlined"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="officer">Officer</MenuItem>
                <MenuItem value="auditor">Auditor</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                error={!!formErrors.department}
                helperText={formErrors.department}
                required
                variant="outlined"
              >
                <MenuItem value="Administration">Administration</MenuItem>
                <MenuItem value="Tax Collection">Tax Collection</MenuItem>
                <MenuItem value="Compliance">Compliance</MenuItem>
                <MenuItem value="Audit">Audit</MenuItem>
              </TextField>
            </Grid>
            {formErrors.submit && (
              <Grid item xs={12}>
                <Alert severity="error">{formErrors.submit}</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateDialogOpen(false);
              setFormErrors({});
            }}
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              // Validate form
              const errors = {};
              if (!formData.name) errors.name = 'Full name is required';
              if (!formData.password) errors.password = 'Password is required';
              if (formData.password && formData.password.length < 8) {
                errors.password = 'Password must be at least 8 characters';
              }
              if (!formData.email) errors.email = 'Email is required';
              if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.email = 'Please enter a valid email address';
              }
              if (!formData.role) errors.role = 'Role is required';
              if (!formData.department) errors.department = 'Department is required';

              if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
              }

              setCreatingUser(true);
              try {
                // Backend removed username field - email is automatically used as username
                // Use the register endpoint which creates both user and staff records
                const result = await userManagementService.createUser({
                  name: formData.name,
                  password: formData.password,
                  email: formData.email,
                  role: formData.role,
                  department: formData.department,
                });
                
                // Extract user/staff info from response
                const userData = result?.data?.user || result?.user;
                const staffData = result?.data?.staff || result?.staff;
                const staffId = userData?.staffId || staffData?.staffId || 'N/A';
                const userName = userData?.name || formData.name;
                
                // Show success notification
                setSnackbar({
                  open: true,
                  message: `Staff member "${userName}" (${staffId}) created successfully!`,
                  severity: 'success',
                });
                
                setCreateDialogOpen(false);
                setFormData({
                  name: '',
                  password: '',
                  email: '',
                  role: 'officer',
                  department: '',
                });
                setFormErrors({});
                await loadUsers(); // Refresh the list
              } catch (err) {
                console.error('Error registering user:', err);
                const errorMessage = 
                  err?.response?.data?.error || 
                  err?.response?.data?.message || 
                  err?.message || 
                  err?.error || 
                  'Failed to register user';
                setFormErrors({ submit: errorMessage });
                setError(errorMessage);
                setSnackbar({
                  open: true,
                  message: errorMessage,
                  severity: 'error',
                });
              } finally {
                setCreatingUser(false);
              }
            }}
            disabled={creatingUser}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            {creatingUser ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: theme.palette.secondary.main }} />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Edit color="primary" />
            <Typography variant="h6" component="span">Edit User</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={selectedUser.username}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
                  helperText="Username cannot be changed"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  error={!!editFormErrors.name}
                  helperText={editFormErrors.name || 'Full name of the user'}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  error={!!editFormErrors.email}
                  helperText={editFormErrors.email}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  error={!!editFormErrors.role}
                  helperText={editFormErrors.role}
                  required
                  variant="outlined"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="officer">Officer</MenuItem>
                  <MenuItem value="auditor">Auditor</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Department"
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  error={!!editFormErrors.department}
                  helperText={editFormErrors.department}
                  required
                  variant="outlined"
                >
                  <MenuItem value="Administration">Administration</MenuItem>
                  <MenuItem value="Tax Collection">Tax Collection</MenuItem>
                  <MenuItem value="Compliance">Compliance</MenuItem>
                  <MenuItem value="Audit">Audit</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={editFormData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'active' })}
                  variant="outlined"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
              {editFormErrors.submit && (
                <Grid item xs={12}>
                  <Alert severity="error">{editFormErrors.submit}</Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditDialogOpen(false);
              setEditFormErrors({});
            }}
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
            }}
          >
            Cancel
          </Button>
        <Button
          variant="contained"
          onClick={handleUpdateUser}
          disabled={updatingUser}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.secondary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          {updatingUser ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: theme.palette.secondary.main }} />
              Updating...
            </>
          ) : (
            'Update User'
          )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{selectedUser?.username}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={verificationDialog.open}
        onClose={() => setVerificationDialog({ open: false, user: null, result: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Security color="primary" />
            <Typography variant="h6">Data Integrity Verification</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {verifying ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : verificationDialog.result ? (
            <Box sx={{ mt: 2 }}>
              {verificationDialog.result.error ? (
                <Alert severity="error">{verificationDialog.result.error}</Alert>
              ) : (
                <>
                  {verificationDialog.result.verified ? (
                    <Alert severity="success" icon={<VerifiedUser />} sx={{ mb: 3 }}>
                      User record verified successfully. Database and blockchain records match.
                    </Alert>
                  ) : (
                    <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
                      Data discrepancies detected. Database and blockchain records do not match.
                    </Alert>
                  )}

                  {verificationDialog.result.discrepancies &&
                    verificationDialog.result.discrepancies.length > 0 && (
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Database Value</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Blockchain Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {verificationDialog.result.discrepancies.map((disc, index) => (
                              <TableRow key={index}>
                                <TableCell>{disc.field}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="error">
                                    {disc.database}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="success.main" fontWeight={600}>
                                    {disc.blockchain}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Database Record
                        </Typography>
                        {verificationDialog.result.database?.name && (
                          <Typography variant="body2">
                            <strong>Name:</strong> {verificationDialog.result.database.name}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          <strong>Email:</strong> {verificationDialog.result.database?.email || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Role:</strong> {verificationDialog.result.database?.role || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Department:</strong> {verificationDialog.result.database?.department || 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Blockchain Record (Source of Truth)
                        </Typography>
                        {verificationDialog.result.blockchain?.name && (
                          <Typography variant="body2">
                            <strong>Name:</strong> {verificationDialog.result.blockchain.name}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          <strong>Email:</strong> {verificationDialog.result.blockchain?.email || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Role:</strong> {verificationDialog.result.blockchain?.role || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Department:</strong> {verificationDialog.result.blockchain?.department || 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationDialog({ open: false, user: null, result: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList;

