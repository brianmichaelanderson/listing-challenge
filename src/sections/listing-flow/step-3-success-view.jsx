'use client';

import { Box, Typography, Alert, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/custom-breadcrumbs';

export default function Step3SuccessView() {
  const router = useRouter();

  return (
    <Box>
      <CustomBreadcrumbs
        heading='Create Listing'
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'New Listing', href: '/listing-flow/step-3' },
          { name: 'Step 3' },
        ]}
      />
      <Typography variant='h5'>Success!</Typography>
      <Alert severity='success'>New property listing details confirmed successfully.</Alert>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant='contained'
          onClick={() => router.push('/')}
        >
          Start Over
        </Button>
      </Box>
    </Box>
  );
}
