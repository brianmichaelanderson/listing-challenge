'use client';

import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

/**
 * React Hook Form Text Field Wrapper
 * Integrates MUI TextField with React Hook Form
 */
export default function RHFTextField({ name, label, helperText, type = 'text', ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          label={label}
          error={!!error}
          helperText={error ? error.message : helperText}
          {...other}
        />
      )}
    />
  );
}
