// App.tsx
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Suspense, lazy } from 'react';
import { ROUTES } from './config/constants';
import './styles/App.css';
import { useAuthStore } from '@/stores/authStore';
import RequireAuth from '@/routes/RequireAuth'; // ✅ 加入 Route 守門人

// 懶加載頁面組件
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const ProductList = lazy(() => import('@/pages/products/ProductList')); 
const Settings = lazy(() => import('@/pages/settings/Settings'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

// 載入中顯示的組件
const Loading = () => <div className="loading">載入中...</div>;

function App() {
  useEffect(() => {
    useAuthStore.getState().initFromServer();
  }, []);
  
  return (
    <div className="app">
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 不需登入可訪問 */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* 需登入才能訪問的頁面 */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.PRODUCTS}
            element={
              <RequireAuth>
                <ProductList />
              </RequireAuth>
            }
          />  
          <Route
            path={ROUTES.SETTINGS}
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
