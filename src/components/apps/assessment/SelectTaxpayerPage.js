export const SelectTaxpayerPage = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', sector: '', region: '' });
  const [taxpayers, setTaxpayers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tpResponse, assResponse] = await Promise.all([
          taxpayerService.getAllTaxpayers(),
          taxpayerService.getAllAssessments(),
        ]);

        setTaxpayers(tpResponse);
        setAssessments(assResponse);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const processedTaxpayers = taxpayers.map((tp) => {
    const tpAssessments = assessments.filter((a) => a.Tin === tp.TIN);
    return {
      id: tp.ID,
      name: tp.Name,
      tin: tp.TIN,
      type: tp.Type,
      sector: tp.BusinessCategory,
      region: extractRegion(tp.RegistrationAddress),
      lastAssessment: tpAssessments[0]?.DueDate || tp.LastAuditDate,
      assessments: tpAssessments.length,
      unpaid: tpAssessments.some((a) => a.Status === 'Pending'),
      totalTaxDue: tpAssessments
        .filter((a) => a.Status === 'Pending')
        .reduce((sum, a) => sum + (a.Amount || 0), 0),
      assessmentStatus: tpAssessments[0]?.Status || 'No Assessments',
    };
  });

  const filteredTaxpayers = processedTaxpayers.filter((tp) => {
    const searchMatch = `${tp.name} ${tp.tin}`.toLowerCase().includes(search.toLowerCase());
    const filterMatch = Object.entries(filters).every(
      ([key, value]) => !value || tp[key] === value,
    );
    return searchMatch && filterMatch;
  });

  // Metrics calculations
  const metrics = {
    totalTaxpayers: filteredTaxpayers.length,
    totalAssessments: filteredTaxpayers.reduce((sum, tp) => sum + tp.assessments, 0),
    totalUnpaid: filteredTaxpayers.reduce((sum, tp) => sum + tp.totalTaxDue, 0),
    statusDistribution: filteredTaxpayers.reduce((acc, tp) => {
      acc[tp.assessmentStatus] = (acc[tp.assessmentStatus] || 0) + 1;
      return acc;
    }, {}),
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading taxpayer data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
      <Box
        sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Tax Assessment Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {taxpayers.length > 0
              ? `Managing ${taxpayers.length} taxpayers`
              : 'Using demonstration data'}
          </Typography>
        </Box>
        <Chip
          label="Auditor | TRA Arusha Office"
          color="primary"
          variant="outlined"
          sx={{ px: 2, py: 1 }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          {
            icon: <Person />,
            title: 'Total Taxpayers',
            value: metrics.totalTaxpayers,
            color: 'primary',
          },
          {
            icon: <ListAlt />,
            title: 'Total Assessments',
            value: metrics.totalAssessments,
            color: 'secondary',
          },
          {
            icon: <MonetizationOn />,
            title: 'Unpaid Balance',
            value: `TZS ${metrics.totalUnpaid.toLocaleString()}`,
            color: 'error',
          },
          {
            icon: <Paid />,
            title: 'Avg. Unpaid',
            value: `TZS ${Math.round(
              metrics.totalUnpaid / (filteredTaxpayers.length || 1),
            ).toLocaleString()}`,
            color: 'warning',
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search taxpayers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {['type', 'sector', 'region'].map((filter) => (
            <Grid item xs={12} md={2.5} key={filter}>
              <TextField
                select
                fullWidth
                label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                value={filters[filter]}
                onChange={(e) => setFilters((prev) => ({ ...prev, [filter]: e.target.value }))}
                variant="outlined"
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(processedTaxpayers.map((tp) => tp[filter]))].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {filteredTaxpayers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.default' }}>
          <Search sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No matching taxpayers found
          </Typography>
          <Typography color="text.secondary">
            Try adjusting your search filters or register a new taxpayer
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" gutterBottom>
              Assessment Status Distribution:
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {Object.entries(metrics.statusDistribution).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  variant="outlined"
                  sx={{
                    borderColor: getStatusColor(status, theme),
                    color: getStatusColor(status, theme),
                  }}
                />
              ))}
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {filteredTaxpayers.map((taxpayer) => (
              <Grid item xs={12} sm={6} lg={4} key={taxpayer.id}>
                <TaxpayerCard taxpayer={taxpayer} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Box sx={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" startIcon={<Add />} sx={{ borderRadius: 50 }}>
          New Taxpayer
        </Button>
        <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 50 }}>
          Save Filters
        </Button>
      </Box>
    </Box>
  );
};
