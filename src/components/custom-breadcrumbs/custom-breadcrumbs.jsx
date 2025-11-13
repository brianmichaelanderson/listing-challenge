'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

/**
 * Custom Breadcrumbs Component
 * Simple navigation breadcrumbs
 */
export default function CustomBreadcrumbs({ heading, links = [] }) {
  return (
    <Box sx={{ mb: 3 }}>
      {heading && (
        <Typography variant="h4" sx={{ mb: 1 }}>
          {heading}
        </Typography>
      )}

      {links.length > 0 && (
        <Breadcrumbs>
          {links.map((link, index) => {
            const isLast = index === links.length - 1;

            return isLast ? (
              <Typography key={link.name} variant="body2" color="text.secondary">
                {link.name}
              </Typography>
            ) : (
              <Link key={link.name} href={link.href} underline="hover" color="inherit">
                {link.name}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
    </Box>
  );
}













