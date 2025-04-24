// src/components/product/CardHeader.tsx

import React from 'react';
import { Product } from '../../types/product';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

interface CardHeaderProps {
  product: Product;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  onChange?: (field: keyof Product, value: string) => void;
  onSave?: () => void;
  onDelete?: () => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  product,
  isSelected,
  onSelect,
  onToggleExpand,
  isExpanded,
  onChange,
  onSave,
  onDelete
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        mb: 4,
        pb: 2,
        px: 2,
        pt: 2,
        backgroundColor: isExpanded ? 'grey.100' : 'white',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onClick={onToggleExpand}
    >
      <Grid container spacing={2} alignItems="center" wrap="wrap">
        <Grid item>
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'medium',
              borderRadius: 1,
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {product.mainImage ? (
              <img src={product.mainImage} alt="商品預覽" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              '無圖片'
            )}
          </Box>
        </Grid>

        <Grid item>
          <Typography variant="body1" fontWeight="bold" color="primary">
            #{product.id}
          </Typography>
        </Grid>

        <Grid item>
          <TextField
            label="檔口"
            variant="standard"
            size="small"
            value={product.stallName || ''}
            onChange={(e) => onChange?.('stallName', e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </Grid>

        <Grid item>
          <TextField
            label="來源"
            variant="standard"
            size="small"
            value={product.source || ''}
            onChange={(e) => onChange?.('source', e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </Grid>

        <Grid item>
          <TextField
            label="連結"
            variant="standard"
            size="small"
            value={product.sourceUrl || ''}
            onChange={(e) => onChange?.('sourceUrl', e.target.value)}
            sx={{ width: 200 }}
            onClick={(e) => e.stopPropagation()}
          />
        </Grid>

        <Grid item xs />

        <Grid item>
          <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
            {onSave && (
              <Button variant="contained" size="small" onClick={onSave}>
                儲存
              </Button>
            )}
            {onDelete && (
              <Button variant="outlined" size="small" color="error" onClick={onDelete}>
                刪除
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      {isExpanded && (
        <Box mt={2} onClick={(e) => e.stopPropagation()}>
          <TextField
            label="商品名稱"
            variant="standard"
            fullWidth
            value={product.name || ''}
            onChange={(e) => onChange?.('name', e.target.value)}
          />
        </Box>
      )}
    </Paper>
  );
};

export default CardHeader;