'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormProvider from '../../components/hook-form/form-provider';
import RHFTextField from '../../components/hook-form/rhf-text-field'; //for text input
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/custom-breadcrumbs';
import axios from '../../lib/axios';

/**
 * Step 2: Property Confirmation View
 *
 * TODO: IMPLEMENT THIS COMPONENT
 *
 * Requirements:
 * 1. Fetch progress data from Step 1 (GET /api/progress)
 * 2. Display property details from step1 data
 * 3. Allow user to edit the sqft field
 * 4. Save updated data (PUT /api/progress) with step-2 completion
 * 5. Navigate to step-3 (or show success message)
 *
 * Reference:
 * - See step-1-property-selection-view.jsx for patterns
 * - Use React Hook Form for the sqft field
 * - Handle loading and error states
 * - Save progress before navigation
 *
 * Data Structure (from Step 1):
 * progressData.step1 = {
 *   selectedPropertyId: "prop-456",
 *   propertyAddress: "123 Main Street, San Francisco, CA 94102",
 *   bedrooms: 3,
 *   bathrooms: 2,
 *   sqft: 1500,
 *   estimatedValue: 850000
 * }
 *
 * What to Save (Step 2):
 * progressData.step2 = {
 *   confirmedSqft: [user edited value],
 *   confirmedBedrooms: [from step1],
 *   confirmedBathrooms: [from step1]
 * }
 */

//Validation schema for step 2 - square footage
const Step2Schema = z.object({
  sqft: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(500, 'Must be at least 500 sqft')
    .max(10000, 'Must be less than 10,000 sqft'),
});

export default function Step2ConfirmationView() {
  const router = useRouter();
  // TODO: Add state for:
  // - progress data
  // - loading state
  // - error state
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sqft, setSqft] = useState(0);

  // - form methods
  const formMethods = useForm({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      sqft: 0,
    },
  });

  const { handleSubmit, setValue } = formMethods;

  // TODO: Fetch progress on mount
  useEffect(() => {
    // Fetch progress from /api/progress
    fetchProgress();
  }, [setValue]);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('/api/progress/');

      if (response.data.success) {
        const fetchedProgressData = response.data.progress.progress_data || {};
        setProgressData(fetchedProgressData);

        // Extract step1 data
        const step1Data = fetchedProgressData.step1;
        if (step1Data?.sqft) {
          setValue('sqft', step1Data.sqft);
        }
      } else {
        setError('Failed to load progress');
      }
    } catch (err) {
      console.error('Error fetching properties', err);
      setError(err.response?.data?.error || 'Failed to load progress');
    } finally {
      setIsLoading(false);
    }
  };


  // TODO: Implement form submission
  const onSubmit = async (data) => {
    // Save step2 data to /api/progress
    // Navigate to next step or show success
  };

  //extract step1 data from state/ProgressData to populate jsx
  const step1Data = progressData.step1;

  return (
    <Box>
      <CustomBreadcrumbs
        heading='Create Listing'
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'New Listing', href: '/listing-flow/step-1' },
          { name: 'Step 2' },
        ]}
      />

      <Typography variant='h5' sx={{ mb: 1 }}>
        Step 2: Confirm Property Details
      </Typography>

      <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
        Review and confirm the property details below. You can edit the square
        footage if needed.
      </Typography>

      {/* TODO: Add loading state */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* TODO: Add error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* TODO: Add form with property details */}
      {!isLoading && step1Data && (
        <FormProvider methods={formMethods} onSubmit={onSubmit}>
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
              Address: {step1Data.propertyAddress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bedrooms: {step1Data.bedrooms} | Bathrooms: {step1Data.bathrooms} | Sqft: {step1Data.sqft}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimated Value: ${step1Data.estimatedValue}
            </Typography>
          </Box>
        </FormProvider>
      )}


      {/* TODO: Add editable sqft field */}

      {/* TODO: Add navigation buttons (Back to Step 1, Continue) */}

      <Alert severity='info' sx={{ mt: 3 }}>
        This component needs to be implemented. See the comments and
        requirements above.
      </Alert>
    </Box>
  );
}
