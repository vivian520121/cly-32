import { Info, Star, Share2, FileText, Shield, HelpCircle, MessageSquare } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SettingGroup } from '@/components/settings/SettingGroup';
import { SettingItem } from '@/components/settings/SettingItem';

export const AboutPanel = () => {
  const { settings } = useSettingsStore();

  const appInfo = {
    version: '1.0.0',
    buildNumber: '20240101',
    lastUpdated: new Date(settings.updatedAt).toLocaleDateString('zh-CN'),
  };

  return (
    <div>
      <SettingGroup title="应用信息">
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">短</span>
          </div>
          <h2 className="text-white font-bold text-xl">短视频</h2>
          <p className="text-gray-500 text-sm mt-1">版本 {appInfo.version}</p>
          <p className="text-gray-600 text-xs mt-1">Build {appInfo.buildNumber}</p>
          <p className="text-gray-600 text-xs mt-1">设置最后更新: {appInfo.lastUpdated}</p>
        </div>
      </SettingGroup>

      <SettingGroup title="给我们评分" description="如果喜欢这个应用，请在应用商店给我们评分">
        <SettingItem
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          title="评分与评价"
          description="分享您的使用体验"
          onClick={() => {}}
        />
      </SettingGroup>

      <SettingGroup title="分享" description="分享给您的朋友">
        <SettingItem
          icon={<Share2 className="w-5 h-5 text-blue-500" />}
          title="分享应用"
          description="邀请好友一起使用"
          onClick={() => {}}
        />
      </SettingGroup>

      <SettingGroup title="法律与协议">
        <SettingItem
          icon={<FileText className="w-5 h-5 text-gray-400" />}
          title="用户协议"
          description="查看使用条款"
          onClick={() => {}}
        />
        <SettingItem
          icon={<Shield className="w-5 h-5 text-gray-400" />}
          title="隐私政策"
          description="了解我们如何处理数据"
          onClick={() => {}}
        />
      </SettingGroup>

      <SettingGroup title="帮助与支持">
        <SettingItem
          icon={<HelpCircle className="w-5 h-5 text-gray-400" />}
          title="帮助中心"
          description="常见问题解答"
          onClick={() => {}}
        />
        <SettingItem
          icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
          title="联系客服"
          description="提交反馈或报告问题"
          onClick={() => {}}
        />
        <SettingItem
          icon={<Info className="w-5 h-5 text-gray-400" />}
          title="关于我们"
          description="了解团队和愿景"
          onClick={() => {}}
        />
      </SettingGroup>

      <div className="text-center py-8">
        <p className="text-gray-600 text-xs">© 2024 短视频. All rights reserved.</p>
        <p className="text-gray-700 text-xs mt-2">Made with ❤️ in China</p>
      </div>
    </div>
  );
};
