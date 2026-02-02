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
  Fade,
  Grow,
} from '@mui/material';
import {
  Assessment,
  Business,
  ListAlt,
  ArrowForward,
  Search,
} from '@mui/icons-material';
import api from 'src/services/api';

const AssessmentHub = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [taxpayerOptions, setTaxpayerOptions] = useState([]);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTaxpayers();
  }, []);

  const loadTaxpayers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/taxpayers');
      const taxpayers = response.taxpayers || [];
      const normalized = taxpayers.map((tp) => ({
        id: tp.ID,
        name: tp.Name,
        tin: tp.TIN,
        type: tp.Type,
        display: `${tp.Name} (${tp.TIN})`,
      }));
      setTaxpayerOptions(normalized);
    } catch (e) {
      console.error('Error loading taxpayers:', e);
      setTaxpayerOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllAssessments = () => {
    navigate('/apps/assessment/list');
  };

  const handleViewByTaxpayer = () => {
    if (selectedTaxpayer?.tin) {
      navigate(`/tax/taxpayer/${selectedTaxpayer.tin}/assessments`);
    }
  };

  const OptionCard = ({ icon, title, description, onClick, color = 'primary', variant = 'default' }) => {
    return (
      <Grow in={true} timeout={600}>
        <Card
          sx={{
            height: '100%',
            p: 4,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background:
              variant === 'gradient'
                ? `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`
                : 'transparent',
            border: `2px solid ${alpha(theme.palette[color].main, 0.2)}`,
            borderRadius: 3,
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: `0 12px 32px ${alpha(theme.palette[color].main, 0.3)}`,
              borderColor: theme.palette[color].main,
            },
          }}
          onClick={onClick}
        >
          <CardContent sx={{ textAlign: 'center', p: 0 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: theme.palette[color].main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.4)}`,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom color={theme.palette[color].main}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, minHeight: 48 }}>
              {description}
            </Typography>
            <Button
              variant="contained"
              color={color}
              endIcon={<ArrowForward />}
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </Grow>
    );
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Fade in={true} timeout={600}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Tax Assessment Management
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Choose how you want to view and manage tax assessments
          </Typography>
        </Box>
      </Fade>

      {/* Main Options */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <OptionCard
            icon={<ListAlt sx={{ fontSize: 40, color: theme.palette.text.primary }} />}
            title="All Assessments"
            description="View and manage all tax assessments across all taxpayers. Perfect for comprehensive oversight and bulk operations."
            onClick={handleViewAllAssessments}
            color="primary"
            variant="gradient"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <OptionCard
            icon={<Business sx={{ fontSize: 40, color: theme.palette.text.primary }} />}
            title="By Taxpayer"
            description="Focus on a specific taxpayer's assessments and liabilities. Ideal for detailed taxpayer management and compliance tracking."
            onClick={() => {}}
            color="secondary"
            variant="gradient"
          />
        </Grid>
      </Grid>

      {/* Taxpayer Search Section */}
      <Fade in={true} timeout={1000}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Search color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Search Taxpayer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a taxpayer to view all their assessments and liabilities
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <Autocomplete
                loading={loading}
                options={taxpayerOptions}
                getOptionLabel={(option) => option.display || ''}
                value={selectedTaxpayer}
                onChange={(event, newValue) => setSelectedTaxpayer(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search by Name or TIN"
                    placeholder="Type to search taxpayers..."
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Search sx={{ mr: 1, color: 'action.active' }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={handleViewByTaxpayer}
                disabled={!selectedTaxpayer}
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                View Assessments
              </Button>
            </Grid>
          </Grid>

          {selectedTaxpayer && (
            <Fade in={true}>
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected Taxpayer:
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedTaxpayer.name} - TIN: {selectedTaxpayer.tin}
                </Typography>
              </Box>
            </Fade>
          )}
        </Paper>
      </Fade>

      {/* Quick Stats */}
      <Fade in={true} timeout={1400}>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Assessment color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight={600} color="primary">
                Comprehensive View
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All assessments in one place
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
              }}
            >
              <Business color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight={600} color="secondary">
                Focused Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taxpayer-specific insights
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: alpha(theme.palette.success.main, 0.05),
              }}
            >
              <Assessment color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight={600} color="success.main">
                Easy Navigation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intuitive workflow design
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Fade>
    </Box>
  );
};

export default AssessmentHub;

