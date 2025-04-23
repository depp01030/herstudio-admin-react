import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <h1>儀表板</h1>
      <div className="dashboard-content">
        <p>歡迎回來！這裡是您的產品管理儀表板。</p>
        {/* 數據卡和圖表將在此處添加 */}
        <div className="data-summary">
          <div className="stats-card">
            <h3>總產品數</h3>
            <div className="card-value">0</div>
          </div>
          <div className="stats-card">
            <h3>缺貨產品</h3>
            <div className="card-value">0</div>
          </div>
          <div className="stats-card">
            <h3>本月新增</h3>
            <div className="card-value">0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;