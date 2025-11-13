import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/custom-breadcrumbs';

export default function Step3SuccessPage() {
  const router = useRouter;

  return (
    <Box>
      <CustomBreadcrumbs>
        heading="Create Listing" links=
        {[
          { name: 'Dashboard', href: '/' },
          { name: 'New Listing', href: '/listing-flow/step-3' },
          { name: 'Step 3' },
        ]}
      </CustomBreadcrumbs>
    </Box>
  );
}
