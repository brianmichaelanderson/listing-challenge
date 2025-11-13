'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormProvider from '../../components/hook-form/form-provider';
import RHFSelect from '../../components/hook-form/rhf-select';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/custom-breadcrumbs';
import axios from '../../lib/axios';

/**
 * Validation Schema
 */
const Step1Schema = z.object({
  propertyId: z.string().min(1, 'Please select a property'),
});

/**
 * Step 1: Property Selection View
 *
 * This is a COMPLETE REFERENCE implementation.
 * Study this to understand:
 *
 * - How we structure views
 * - How we fetch data from APIs
 * - How we use React Hook Form
 * - How we handle navigation between steps
 * - How we save progress
 */
export default function Step1PropertySelectionView() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with React Hook Form
  const methods = useForm({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      propertyId: '',
    },
  });

  const { handleSubmit, watch } = methods;
  const selectedPropertyId = watch('propertyId');

  /**
   * Fetch properties on component mount
   */
  useEffect(() => {
    fetchProperties();
  }, []);

  /**
   * Fetch available properties from API
   */
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/api/listing/properties');

      if (response.data.success) {
        setProperties(response.data.properties || []);
      } else {
        setError('Failed to load properties');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.response?.data?.error || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   * Saves progress and navigates to next step
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      setError(null);

      // Find selected property details
      const selectedProperty = properties.find((p) => p.id === data.propertyId);

      if (!selectedProperty) {
        setError('Invalid property selection');
        return;
      }

      // Save progress to backend
      const progressData = {
        completedSteps: ['step-1'],
        step1: {
          selectedPropertyId: selectedProperty.id,
          propertyAddress: `${selectedProperty.address}, ${selectedProperty.city}, ${selectedProperty.state} ${selectedProperty.zip}`,
          bedrooms: selectedProperty.bedrooms,
          bathrooms: selectedProperty.bathrooms,
          sqft: selectedProperty.sqft,
          estimatedValue: selectedProperty.estimated_value,
        },
      };

      // Call progress API
      await axios.put('/api/progress', {
        currentStep: 'step-1',
        progressData,
      });

      // Navigate to next step
      router.push('/listing-flow/step-2');
    } catch (err) {
      console.error('Error saving progress:', err);
      setError(err.response?.data?.error || 'Failed to save progress');
    } finally {
      setSubmitting(false);
    }
  });

  /**
   * Get selected property for preview
   */
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Create Listing"
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'New Listing', href: '/listing-flow/step-1' },
          { name: 'Step 1' },
        ]}
      />

      <Typography variant="h5" sx={{ mb: 1 }}>
        Step 1: Select Your Property
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose the property you want to list from your available properties.
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
      {!loading && properties.length > 0 && (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Property Selector */}
            <RHFSelect
              name="propertyId"
              label="Select Property"
              options={properties.map((property) => ({
                value: property.id,
                label: `${property.address}, ${property.city}, ${property.state}`,
              }))}
              helperText="Choose the property you want to create a listing for"
            />

            {/* Property Preview */}
            {selectedProperty && (
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Property Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bedrooms: {selectedProperty.bedrooms} | Bathrooms: {selectedProperty.bathrooms} | Sqft: {selectedProperty.sqft.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estimated Value: ${selectedProperty.estimated_value.toLocaleString()}
                </Typography>
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!selectedPropertyId || submitting}
              >
                {submitting ? 'Saving...' : 'Continue to Step 2'}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      )}

      {/* No Properties State */}
      {!loading && properties.length === 0 && (
        <Alert severity="info">
          No properties available. In a real app, you would add properties first.
        </Alert>
      )}
    </Box>
  );
}













