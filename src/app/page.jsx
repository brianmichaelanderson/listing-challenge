'use client';

import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Home Page
 * Landing page with link to start the listing flow
 */
export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Property Listing Platform
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome to the listing challenge. Click below to start creating a property listing.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/listing-flow/step-1"
          >
            Start New Listing
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}













