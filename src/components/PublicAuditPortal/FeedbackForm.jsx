import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Feedback as FeedbackIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const FeedbackForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    category: '',
    message: '',
    email: '',
    anonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const categories = [
    { value: 'data_quality', label: 'Data Quality Issue', labelSw: 'Tatizo la Ubora wa Data' },
    { value: 'accessibility', label: 'Accessibility Concern', labelSw: 'Suala la Upatikanaji' },
    { value: 'suggestion', label: 'Improvement Suggestion', labelSw: 'Pendekezo la Uboreshaji' },
    { value: 'technical', label: 'Technical Issue', labelSw: 'Tatizo la Kiufundi' },
    { value: 'transparency', label: 'Transparency Request', labelSw: 'Ombi la Uwazi' },
    { value: 'other', label: 'Other', labelSw: 'Nyingine' },
  ];

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.checked,
    });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.category || !formData.message.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would normally send the data to your backend
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9),
      };

      console.log('Feedback submitted:', submissionData);

      showNotification(
        formData.anonymous
          ? 'Anonymous feedback submitted successfully'
          : 'Feedback submitted successfully. We will review your submission.',
        'success',
      );

      // Reset form
      setFormData({
        category: '',
        message: '',
        email: '',
        anonymous: false,
      });
    } catch (error) {
      showNotification('Error submitting feedback. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <FeedbackIcon color="primary" />
          <Typography variant="h5" component="h1">
            {t('feedback.title')}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('feedback.description')}
        </Typography>

        {/* Privacy Notice */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'info.light',
            borderRadius: 1,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SecurityIcon color="info" />
          <Typography variant="body2">
            Your feedback helps improve transparency and data quality. All submissions are treated
            confidentially and reviewed by our team.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Category Selection */}
            <FormControl fullWidth required>
              <InputLabel id="category-label">{t('feedback.category')}</InputLabel>
              <Select
                labelId="category-label"
                value={formData.category}
                onChange={handleInputChange('category')}
                label={t('feedback.category')}
                aria-describedby="category-helper"
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box>
                      <Typography variant="body2">{category.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.labelSw}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Message */}
            <TextField
              label={t('feedback.message')}
              multiline
              rows={6}
              value={formData.message}
              onChange={handleInputChange('message')}
              required
              fullWidth
              placeholder="Please describe your feedback, suggestion, or concern in detail..."
              aria-describedby="message-helper"
              inputProps={{
                maxLength: 2000,
                'aria-label': 'Feedback message',
              }}
              helperText={`${formData.message.length}/2000 characters`}
            />

            {/* Anonymous Option */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.anonymous}
                  onChange={handleCheckboxChange('anonymous')}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2">{t('feedback.anonymous')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your identity will not be recorded or shared
                  </Typography>
                </Box>
              }
            />

            {/* Email (only if not anonymous) */}
            {!formData.anonymous && (
              <TextField
                label="Email (Optional)"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                fullWidth
                placeholder="your.email@example.com"
                helperText="Provide your email if you'd like a response to your feedback"
                inputProps={{
                  'aria-label': 'Email address',
                }}
              />
            )}

            <Divider />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              disabled={loading || !formData.category || !formData.message.trim()}
              sx={{ alignSelf: 'flex-start' }}
            >
              {loading ? 'Submitting...' : t('feedback.submit')}
            </Button>
          </Box>
        </form>

        {/* Accessibility Information */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Accessibility Support
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This form is compatible with screen readers and keyboard navigation. Use Tab to navigate
            between fields and Enter to submit. For additional assistance, contact our accessibility
            team.
          </Typography>
        </Box>
      </CardContent>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default FeedbackForm;
