'use client';

import { Box, Container, Stepper, Step, StepLabel, Paper } from '@mui/material';
import { usePathname } from 'next/navigation';

/**
 * Listing Flow Layout
 * Shows progress stepper and wraps all flow pages
 */
export default function ListingFlowLayout({ children }) {
  const pathname = usePathname();

  // Determine active step from pathname
  const steps = ['Select Property', 'Confirm Details', 'Submit'];
  const activeStep = pathname.includes('step-2') ? 1 : pathname.includes('step-3') ? 2 : 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{children}</Box>
      </Paper>
    </Container>
  );
}













