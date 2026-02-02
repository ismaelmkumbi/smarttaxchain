import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  alpha,
  Paper,
  Autocomplete,
  TextField,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import {
  Assessment,
  Business,
  Person,
  Search,
  ArrowForward,
  AccountCircle,
} from '@mui/icons-material';
import api from 'src/services/api';

const TaxpayerSearch = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [taxpayerOptions, setTaxpayerOptions] = useState([]);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTaxpayers();
  }, []);

  const loadTaxpayers = async () => {
    try {
      setSearchLoading(true);
      setError(null);
      const response = await api.get('/taxpayers');
      const taxpayers = response.taxpayers || [];
      const normalized = taxpayers.map((tp) => ({
        id: tp.ID,
        name: tp.Name || tp.name,
        tin: tp.TIN || tp.tin,
        type: tp.Type || tp.type,
        email: tp.Email || tp.email,
        phone: tp.Phone || tp.phone,
        display: `${tp.Name || tp.name} (${tp.TIN || tp.tin})`,
      }));
      setTaxpayerOptions(normalized);
    } catch (e) {
      console.error('Error loading taxpayers:', e);
      setError('Failed to load taxpayers. Please try again.');
      setTaxpayerOptions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleViewAssessments = () => {
    if (selectedTaxpayer?.tin) {
      navigate(`/tax/taxpayer/${selectedTaxpayer.tin}/assessments`);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              bgcolor: 'white',
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderTop: `4px solid ${theme.palette.primary.main}`,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(17, 17, 17, 0.08)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    color: theme.palette.secondary.main,
                  }}
                >
                  <Search sx={{ fontSize: 32, color: theme.palette.secondary.main }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="text.primary">
                    Search Taxpayer Assessments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find and view all tax assessments for a specific taxpayer
                  </Typography>
                </Box>
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: alpha(theme.palette.grey[50], 0.5),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Autocomplete
                      options={taxpayerOptions}
                      getOptionLabel={(option) => option.display || ''}
                      loading={searchLoading}
                      value={selectedTaxpayer}
                      onChange={(event, newValue) => {
                        setSelectedTaxpayer(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Taxpayer by Name or TIN"
                          placeholder="Type to search..."
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                            endAdornment: (
                              <>
                                {searchLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            py: 1.5,
                            px: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              width: 40,
                              height: 40,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {option.type === 'Company' || option.type === 'Partnership' ? (
                              <Business />
                            ) : (
                              <Person />
                            )}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={600}>
                              {option.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              TIN: {option.tin} • {option.type}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleViewAssessments}
                      disabled={!selectedTaxpayer}
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.secondary.main,
                        height: 56,
                        fontWeight: 700,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                          color: theme.palette.secondary.main,
                        },
                        '&:disabled': {
                          bgcolor: theme.palette.grey[300],
                          color: theme.palette.text.secondary,
                        },
                      }}
                    >
                      View Assessments
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {selectedTaxpayer && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 48,
                        height: 48,
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <AccountCircle />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedTaxpayer.name}
                      </Typography>
                      <Stack direction="row" spacing={2} mt={0.5}>
                        <Chip
                          label={`TIN: ${selectedTaxpayer.tin}`}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                            color: theme.palette.secondary.main,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={selectedTaxpayer.type}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.text.primary,
                          }}
                        />
                      </Stack>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={handleViewAssessments}
                      endIcon={<Assessment />}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.secondary.main,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          bgcolor: alpha(theme.palette.primary.main, 0.15),
                          color: theme.palette.secondary.main,
                        },
                      }}
                    >
                      View All Assessments
                    </Button>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Assessment />}
                    onClick={() => navigate('/apps/assessment/list')}
                    sx={{
                      py: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: theme.palette.secondary.main,
                      },
                    }}
                  >
                    View All Assessments
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Business />}
                    onClick={loadTaxpayers}
                    disabled={searchLoading}
                    sx={{
                      py: 2,
                      borderColor: theme.palette.secondary.main, // TRA Black
                      color: theme.palette.secondary.main, // TRA Black
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.palette.secondary.dark,
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        color: theme.palette.secondary.main,
                      },
                      '&:disabled': {
                        borderColor: theme.palette.action.disabled,
                        color: theme.palette.action.disabled,
                      },
                    }}
                  >
                    {searchLoading ? 'Loading...' : 'Refresh Taxpayers'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaxpayerSearch;

