// src/api/admin/productImageApi.ts

import apiService from '@/api/apiService';

export const updateProductImages = (productId: number, form: FormData) => {
  return apiService.post(`/api/admin/products/${productId}/images`, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
