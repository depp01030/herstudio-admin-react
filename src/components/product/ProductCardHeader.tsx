import React, { useState } from 'react';
import { Product } from '@/types/product';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useProductImageActions } from '@/hooks/useProductImageActions';

import { useAuthStore } from '@/stores/authStore'; // ✅ 引入 authStore
interface ProductCardHeaderProps {
  product: Product;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  onChange?: (field: keyof Product, value: string) => void;
  onSave?: () => Promise<void>;
  onDelete?: () => void;
}

const ProductCardHeader: React.FC<ProductCardHeaderProps> = ({
  product,
  isSelected,
  onSelect,
  onToggleExpand,
  isExpanded,
  onChange,
  onSave,
  onDelete,
}) => {
  const { getImagesByProductId, getPreviewImageUrl } = useProductImageActions();
  const images = getImagesByProductId(product.id);
  const previewImageUrl = getPreviewImageUrl(product.id);
  const isImageLoading = images.length === 0;

  const [saving, setSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(true);
  const { hasPermission } = useAuthStore(); // ✅ 權限函式

  const handleSaveClick = async () => {

    if (!onSave) return;
    setSaving(true);

    try { 
      await Promise.all([
        onSave(),
        new Promise((res) => setTimeout(res, 800)),
      ]);
      setSaveSuccess(true);
    } catch (err) {
      console.error('儲存錯誤', err);
      setSaveSuccess(false);
    } finally {
      setSaving(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
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
          transition: 'background-color 0.2s ease',
        }}
        onClick={onToggleExpand}
      >
        <Grid container spacing={2} alignItems="center" wrap="wrap">
          <Grid>
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
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {isImageLoading ? (
                <span>載入中…</span>
              ) : previewImageUrl ? (
                <img
                  src={previewImageUrl}
                  alt="商品預覽"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                '無圖片'
              )}
            </Box>
          </Grid>

          <Grid>
            <Typography variant="body1" fontWeight="bold" color="primary">
              #{product.id}
            </Typography>
          </Grid>

          <Grid>
            <TextField
              label="檔口"
              variant="standard"
              size="small"
              value={product.stallName || ''}
              onChange={(e) => onChange?.('stallName', e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </Grid>

          <Grid>
            <TextField
              label="來源"
              variant="standard"
              size="small"
              value={product.source || ''}
              onChange={(e) => onChange?.('source', e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </Grid>

          <Grid>
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

          <Grid>
          <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
            {hasPermission('canEdit') && onSave && (
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveClick}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={16} /> : null}
              >
                {saving ? '儲存中...' : '儲存'}
              </Button>
            )}
            {hasPermission('canDelete') && onDelete && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                刪除
              </Button>
            )}
          </Stack>

          </Grid>
        </Grid>

        <Grid>
          <Box mt={2} onClick={(e) => e.stopPropagation()}>
            <TextField
              label="商品名稱"
              variant="standard"
              fullWidth
              value={product.name || ''}
              onChange={(e) => onChange?.('name', e.target.value)}
            />
          </Box>
        </Grid>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={saveSuccess ? 'success' : 'error'}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
        >
          {saveSuccess ? '儲存成功' : '儲存失敗，請稍後再試'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCardHeader;
