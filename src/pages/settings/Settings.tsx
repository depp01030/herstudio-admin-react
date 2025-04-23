import React, { useState } from 'react';

interface SettingsState {
  apiUrl: string;
  language: 'zh-TW' | 'en-US';
  darkMode: boolean;
  notificationsEnabled: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    language: 'zh-TW',
    darkMode: false,
    notificationsEnabled: true
  });
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    
    // 模擬保存設置
    setTimeout(() => {
      // 實際應用中，這裡會調用API或保存到localStorage
      localStorage.setItem('app_settings', JSON.stringify(settings));
      
      setIsSaving(false);
      setSaveMessage('設置已成功保存');
      
      // 3秒後清除消息
      setTimeout(() => setSaveMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="settings-page">
      <h1>系統設置</h1>
      
      {saveMessage && (
        <div className="save-message success">
          {saveMessage}
        </div>
      )}
      
      <form onSubmit={handleSaveSettings}>
        <div className="settings-section">
          <h2>API 設置</h2>
          <div className="form-group">
            <label htmlFor="apiUrl">API 基本 URL</label>
            <input
              type="text"
              id="apiUrl"
              name="apiUrl"
              value={settings.apiUrl}
              onChange={handleInputChange}
            />
            <small>用於連接到後端服務的基本 URL</small>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>介面設置</h2>
          
          <div className="form-group">
            <label htmlFor="language">語言</label>
            <select
              id="language"
              name="language"
              value={settings.language}
              onChange={handleInputChange}
            >
              <option value="zh-TW">繁體中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="darkMode"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleInputChange}
            />
            <label htmlFor="darkMode">深色模式</label>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>通知設置</h2>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="notificationsEnabled"
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={handleInputChange}
            />
            <label htmlFor="notificationsEnabled">啟用系統通知</label>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isSaving}>
            {isSaving ? '保存中...' : '保存設置'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;