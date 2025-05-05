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
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '@/types/product';
import useProductFieldStore from '@/stores/productFieldStore';

interface ProductCardInfoProps {
  product: Product;
  onChange: (field: keyof Product, value: any) => void;
}

const ProductCardInfo: React.FC<ProductCardInfoProps> = ({ product, onChange }) => {
  const {
    getMetricLabel,
    getMetricKey,
    defaultSizeMetricsMap,
    sizeMetricLabelMap,
    productTypeLabelMap,
    defaultColorOptions,
    defaultSizeOptions,
  } = useProductFieldStore();

  const [sizeMetrics, setSizeMetrics] = useState<[string, string][]>(
    Object.entries(product.sizeMetrics || {}).map(([k, v]) => [getMetricLabel(k) || k, v])
  );
  const [colors, setColors] = useState<string[]>(product.colors || []);
  const [sizes, setSizes] = useState<string[]>(product.sizes || []);

  useEffect(() => {
    const key = product.customType;
    const existing = product.sizeMetrics || {};
    if (key && key in defaultSizeMetricsMap) {
      const metricKeys = defaultSizeMetricsMap[key as keyof typeof defaultSizeMetricsMap];
      const newMetrics = metricKeys.map((k) => {
        const label = getMetricLabel(k) || k;
        return [label, existing[k] ?? ''] as [string, string];
      });
      setSizeMetrics(newMetrics);
      const converted = Object.fromEntries(newMetrics.map(([label, value]) => [getSafeMetricKey(label), value]));
      onChange('sizeMetrics', converted);
    }
  }, [product.customType]);

  const getSafeMetricKey = (label: string): string => {
    return getMetricKey(label) ?? label;
  };

  const handleMetricChange = (index: number, keyOrValue: 'key' | 'value', newValue: string) => {
    const updated = [...sizeMetrics];
    const [k, v] = updated[index];
    updated[index] = keyOrValue === 'key' ? [newValue, v] : [k, newValue];
    setSizeMetrics(updated);
    const converted = Object.fromEntries(updated.map(([label, value]) => [getSafeMetricKey(label), value]));
    onChange('sizeMetrics', converted);
  };

  const addMetric = () => {
    const updated: [string, string][] = [...sizeMetrics, ['', '']];
    setSizeMetrics(updated);
    const converted = Object.fromEntries(updated.map(([label, value]) => [getSafeMetricKey(label), value]));
    onChange('sizeMetrics', converted);
  };

  const removeMetric = (index: number) => {
    const updated = [...sizeMetrics];
    updated.splice(index, 1);
    setSizeMetrics(updated);
    const converted = Object.fromEntries(updated.map(([label, value]) => [getSafeMetricKey(label), value]));
    onChange('sizeMetrics', converted);
  };

  const parseIntOrZero = (value: string) => {
    const n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
  };

  return (
    <Box>
      {/* 價格區塊 */}
      <Grid container spacing={2}>
        <Grid>
          <TextField
            label="訂購價"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={product.purchasePrice ?? ''}
            fullWidth
            onChange={(e) => onChange('purchasePrice', parseIntOrZero(e.target.value))}
          />
        </Grid>
        <Grid>
          <TextField
            label="總成本"
            type="number"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={product.totalCost ?? ''}
            fullWidth
            onChange={(e) => onChange('totalCost', parseIntOrZero(e.target.value))}
          />
        </Grid>
        <Grid>
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

      {/* 商品描述 */}
      <Box mt={2}>
        <TextField
          label="商品描述"
          value={product.description || ''}
          fullWidth
          multiline
          onChange={(e) => onChange('description', e.target.value)}
        />
      </Box>

      {/* 商品類別選擇 */}
      <Box mt={2}>
        <TextField
          label="商品類別"
          value={product.customType || ''}
          fullWidth
          select
          onChange={(e) => onChange('customType', e.target.value)}
        >
          {Object.entries(productTypeLabelMap).map(([key, label]) => (
            <MenuItem key={key} value={key}>{label}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* 材質 */}
      <Box mt={2}>
        <TextField
          label="材質"
          value={product.material || ''}
          fullWidth
          onChange={(e) => onChange('material', e.target.value)}
        />
      </Box>

      {/* 尺寸明細欄位 */}
      <Box mt={3}>
        <Typography variant="subtitle1">尺寸明細</Typography>
        {sizeMetrics.map(([label, value], index) => (
          <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
            <Autocomplete
              freeSolo
              options={Object.values(sizeMetricLabelMap)}
              value={label}
              onChange={(_, newVal) => handleMetricChange(index, 'key', newVal || '')}
              renderInput={(params) => (
                <TextField {...params} label="欄位" />
              )}
              sx={{ width: 180 }}
            />
            <TextField
              label="內容"
              value={value}
              onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
            />
            <IconButton onClick={() => removeMetric(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Button onClick={addMetric} size="small">新增欄位</Button>
      </Box>

      {/* 顏色選擇 */}
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
            value.map((option, index) => {
              const { key: _ignoredKey, ...rest } = getTagProps({ index });
              return <Chip key={option} label={option} {...rest} />;
            })
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="輸入或選擇顏色" />
          )}
        />
      </Box>

      {/* 尺寸選擇 */}
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
            value.map((option, index) => {
              const { key: _ignoredKey, ...rest } = getTagProps({ index });
              return <Chip key={option} label={option} {...rest} />;
            })
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" placeholder="輸入或選擇尺寸" />
          )}
        />
      </Box>
    </Box>
  );
};

export default ProductCardInfo;
