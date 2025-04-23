import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ROUTES } from './config/constants';
import './styles/App.css';

// 懶加載頁面組件
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard.tsx'));
const ProductList = lazy(() => import('./pages/products/ProductList.tsx'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail.tsx'));
const ProductNew = lazy(() => import('./pages/products/ProductNew.tsx'));
const ProductEdit = lazy(() => import('./pages/products/ProductEdit.tsx'));
const Settings = lazy(() => import('./pages/settings/Settings.tsx'));

// 載入中顯示的組件
const Loading = () => <div className="loading">載入中...</div>;

function App() {
  return (
    <div className="app">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductList />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
          <Route path={ROUTES.PRODUCT_NEW} element={<ProductNew />} />
          <Route path={ROUTES.PRODUCT_EDIT} element={<ProductEdit />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
