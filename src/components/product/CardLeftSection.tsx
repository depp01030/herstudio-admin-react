// src/components/product/CardLeftSection.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '@/types/product';
import { defaultSizeMetricsMap, defaultSizeOptions, defaultColorOptions } from '../../config/defaults';

interface CardLeftSectionProps {
  product: Product;
  onChange: (field: keyof Product, value: any) => void;
}

const CardLeftSection: React.FC<CardLeftSectionProps> = ({ product, onChange }) => {
  const [sizeMetrics, setSizeMetrics] = useState<[string, string][]>(
    Object.entries(product.sizeMetrics || {})
  );
  const [colors, setColors] = useState<string[]>(product.colors || []);
  const [sizes, setSizes] = useState<string[]>(product.sizes || []);

  useEffect(() => {
    if (product.customType && defaultSizeMetricsMap[product.customType]) {
      const newMetrics = defaultSizeMetricsMap[product.customType].map((k) => [k, ''] as [string, string]);
      setSizeMetrics(newMetrics);
      onChange('sizeMetrics', Object.fromEntries(newMetrics));
    }
  }, [product.customType]);

  const handleMetricChange = (index: number, keyOrValue: 'key' | 'value', newValue: string) => {
    const updated = [...sizeMetrics];
    const [k, v] = updated[index];
    updated[index] = keyOrValue === 'key' ? [newValue, v] : [k, newValue];
    setSizeMetrics(updated);
    onChange('sizeMetrics', Object.fromEntries(updated));
  };

  const addMetric = () => {
    const updated = [...sizeMetrics, ['', '']];
    setSizeMetrics(updated);
  };

  const removeMetric = (index: number) => {
    const updated = [...sizeMetrics];
    updated.splice(index, 1);
    setSizeMetrics(updated);
    onChange('sizeMetrics', Object.fromEntries(updated));
  };

  const parseIntOrZero = (value: string) => {
    const n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
  };

  return (
    <Box>
      {/* ｜訂購價＿｜總成本＿｜售價＿ */}
      <Grid container spacing={2}>
        <Grid >
          <TextField
            label="訂購價"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={product.purchasePrice ?? ''}
            fullWidth
            onChange={(e) => onChange('purchasePrice', parseIntOrZero(e.target.value))}
          />
        </Grid>
        <Grid >
          <TextField
            label="總成本"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={product.totalCost ?? ''}
            fullWidth
            onChange={(e) => onChange('totalCost', parseIntOrZero(e.target.value))}
          />
        </Grid>
        <Grid >
          <TextField
            label="售價"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={product.price ?? ''}
            fullWidth
            onChange={(e) => onChange('price', parseIntOrZero(e.target.value))}
          />
        </Grid>
      </Grid>

      {/* 商品描述＿（提前到第二個） */}
      <Box mt={2}>
        <TextField
          label="商品描述"
          value={product.description || ''}
          fullWidth
          multiline
          onChange={(e) => onChange('description', e.target.value)}
        />
      </Box>

      {/* 商品類別＿（下拉式選單） */}
      <Box mt={2}>
        <TextField
          label="商品類別"
          value={product.customType || ''}
          fullWidth
          select
          onChange={(e) => onChange('customType', e.target.value)}
        >
          {Object.keys(defaultSizeMetricsMap).map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* 材質＿ */}
      <Box mt={2}>
        <TextField
          label="材質"
          value={product.material || ''}
          fullWidth
          onChange={(e) => onChange('material', e.target.value)}
        />
      </Box>

      {/* 尺寸明細 */}
      <Box mt={3}>
        <Typography variant="subtitle1">尺寸明細</Typography>
        {sizeMetrics.map(([k, v], index) => (
          <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
            <TextField
              label="欄位"
              value={k}
              onChange={(e) => handleMetricChange(index, 'key', e.target.value)}
            />
            <TextField
              label="內容"
              value={v}
              onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
            />
            <IconButton onClick={() => removeMetric(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Button onClick={addMetric} size="small">新增欄位</Button>
      </Box>

      {/* 顏色 EX:紅黃藍 - 改用 Autocomplete */}
      <Box mt={3}>
        <Typography variant="subtitle1">顏色</Typography>
        <Autocomplete
          multiple
          freeSolo
          options={defaultColorOptions}
          value={colors}
          onChange={(_, newValue) => {
            setColors(newValue);
            onChange('colors', newValue);
          }}
          renderTags={(value: string[], getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option}
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="輸入或選擇顏色"
            />
          )}
        />
      </Box>

      {/* 尺寸 EX:s,m,l,free - 改用 Autocomplete */}
      <Box mt={3}>
        <Typography variant="subtitle1">尺寸</Typography>
        <Autocomplete
          multiple
          freeSolo
          options={defaultSizeOptions}
          value={sizes}
          onChange={(_, newValue) => {
            setSizes(newValue);
            onChange('sizes', newValue);
          }}
          renderTags={(value: string[], getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option}
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="輸入或選擇尺寸"
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default CardLeftSection;
