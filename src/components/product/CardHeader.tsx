// src/components/product/CardHeader.tsx

import React from 'react';
import { Product } from '../../types/product';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface CardHeaderProps {
  product: Product;
  onChange: (field: keyof Product, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  product,
  onChange,
  onSave,
  onDelete
}) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, pb: 2 }}>
      <Grid container spacing={2} alignItems="center" wrap="wrap">
        <Grid item>
          <Typography variant="h6" color="primary" fontWeight="bold">
            商品編號: #{product.id}
          </Typography>
        </Grid>

        <Grid item>
          <TextField
            label="檔口"
            variant="outlined"
            size="small"
            value={product.stallName || ''}
            onChange={(e) => onChange('stallName', e.target.value)}
          />
        </Grid>

        <Grid item>
          <TextField
            label="來源"
            variant="outlined"
            size="small"
            value={product.source || ''}
            onChange={(e) => onChange('source', e.target.value)}
          />
        </Grid>

        <Grid item>
          <TextField
            label="網址"
            variant="outlined"
            size="small"
            value={product.sourceUrl || ''}
            onChange={(e) => onChange('sourceUrl', e.target.value)}
            sx={{ width: 200 }}
          />
        </Grid>

        <Grid item xs />

        <Grid item>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" onClick={onSave}>
              儲存
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={onDelete}
            >
              刪除
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TextField
          label="商品名稱"
          variant="outlined"
          fullWidth
          value={product.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default CardHeader;



