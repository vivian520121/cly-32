import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Palette,
  Bell,
  Shield,
  Info,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SaveToast } from '@/components/settings/SaveToast';
import { AccountSettingsPanel } from './panels/AccountSettingsPanel';
import { PreferencesSettingsPanel } from './panels/PreferencesSettingsPanel';
import { NotificationSettingsPanel } from './panels/NotificationSettingsPanel';
import { PrivacySettingsPanel } from './panels/PrivacySettingsPanel';
import { AboutPanel } from './panels/AboutPanel';
import type { SettingsCategory } from '@/types';
import { cn } from '@/lib/utils';

const categories: { key: SettingsCategory; label: string; icon: React.ReactNode }[] = [
  { key: 'account', label: '账户管理', icon: <User className="w-5 h-5" /> },
  { key: 'preferences', label: '偏好设置', icon: <Palette className="w-5 h-5" /> },
  { key: 'notifications', label: '通知配置', icon: <Bell className="w-5 h-5" /> },
  { key: 'privacy', label: '隐私与安全', icon: <Shield className="w-5 h-5" /> },
  { key: 'about', label: '关于', icon: <Info className="w-5 h-5" /> },
];

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { activeCategory, setActiveCategory, saveSuccess, errors, exportSettings, importSettings, resetToDefaults } = useSettingsStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (type: 'success' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const handleExport = () => {
    const data = exportSettings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('success', '设置已导出');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const success = importSettings(content);
          if (success) {
            showNotification('success', '设置已导入');
          } else {
            showNotification('error', '导入失败，文件格式不正确');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    showNotification('success', '已恢复默认设置');
  };

  const renderPanel = () => {
    switch (activeCategory) {
      case 'account':
        return <AccountSettingsPanel />;
      case 'preferences':
        return <PreferencesSettingsPanel />;
      case 'notifications':
        return <NotificationSettingsPanel />;
      case 'privacy':
        return <PrivacySettingsPanel />;
      case 'about':
        return <AboutPanel />;
      default:
        return <AccountSettingsPanel />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <SaveToast show={showToast} type={toastType} message={toastMessage} />
      <SaveToast show={saveSuccess} type="success" message="保存成功" />
      <SaveToast show={errors.length > 0} type="error" message={errors[0]?.message || '保存失败'} />

      <div className="sticky top-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white font-semibold text-lg">设置</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex h-[calc(100vh-72px)]">
        <div className="w-28 border-r border-gray-800 bg-gray-900/30 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={cn(
                'w-full flex flex-col items-center gap-2 py-4 px-2 text-xs transition-colors',
                'hover:bg-gray-800/50 border-l-2',
                activeCategory === category.key
                  ? 'text-red-500 bg-gray-800/30 border-red-500'
                  : 'text-gray-500 border-transparent'
              )}
            >
              {category.icon}
              <span className="leading-tight">{category.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">{renderPanel()}</div>

          <div className="p-4 border-t border-gray-800 mt-8">
            <h3 className="text-gray-400 text-sm font-medium mb-4">数据管理</h3>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Download className="w-5 h-5 text-gray-400" />
                <span className="text-sm">导出设置</span>
              </button>
              <button
                onClick={handleImport}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm">导入设置</span>
              </button>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm">恢复默认设置</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
          <div className="w-[80%] max-w-sm bg-gray-900 rounded-2xl p-6 animate-scale-in">
            <div className="text-center mb-4">
              <RotateCcw className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-white font-semibold text-lg">恢复默认设置？</h3>
              <p className="text-gray-500 text-sm mt-2">此操作将重置所有设置，无法撤销</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-gray-800 text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
