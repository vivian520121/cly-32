import { useState, useEffect } from 'react';
import {
  Eye,
  Lock,
  MessageSquare,
  Users,
  Search,
  Target,
  Smartphone,
  Clock,
  AlertTriangle,
  Key,
  Trash2,
  Heart,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SettingGroup } from '@/components/settings/SettingGroup';
import { SettingItem } from '@/components/settings/SettingItem';
import { SettingSwitch } from '@/components/settings/SettingSwitch';
import { SettingSelect } from '@/components/settings/SettingSelect';
import type { PrivacySettings, SecuritySettings } from '@/types';
import { cn } from '@/lib/utils';

const visibilityOptions: { value: 'public' | 'followers' | 'private'; label: string }[] = [
  { value: 'public', label: '公开' },
  { value: 'followers', label: '仅粉丝' },
  { value: 'private', label: '仅自己' },
];

export const PrivacySettingsPanel = () => {
  const { settings, updatePrivacySettings, updateSecuritySettings, isSaving, saveSuccess } = useSettingsStore();
  const [localPrivacy, setLocalPrivacy] = useState<PrivacySettings>(settings.privacy);
  const [localSecurity, setLocalSecurity] = useState<SecuritySettings>(settings.security);

  useEffect(() => {
    setLocalPrivacy(settings.privacy);
  }, [settings.privacy]);

  useEffect(() => {
    setLocalSecurity(settings.security);
  }, [settings.security]);

  const handlePrivacyChange = async <K extends keyof PrivacySettings>(
    field: K,
    value: PrivacySettings[K]
  ) => {
    setLocalPrivacy((prev) => ({ ...prev, [field]: value }));
    await updatePrivacySettings({ [field]: value });
  };

  const handleSecurityChange = async <K extends keyof SecuritySettings>(
    field: K,
    value: SecuritySettings[K]
  ) => {
    setLocalSecurity((prev) => ({ ...prev, [field]: value }));
    await updateSecuritySettings({ [field]: value });
  };

  return (
    <div>
      <SettingGroup title="可见性设置" description="控制您的内容和资料的可见范围">
        <SettingItem
          icon={<Eye className="w-5 h-5 text-gray-400" />}
          title="个人资料可见性"
          description="谁可以查看您的个人资料"
          rightElement={
            <SettingSelect
              value={localPrivacy.profileVisibility}
              options={visibilityOptions}
              onChange={(v) => handlePrivacyChange('profileVisibility', v)}
            />
          }
        />

        <SettingItem
          icon={<Lock className="w-5 h-5 text-gray-400" />}
          title="作品可见性"
          description="谁可以查看您发布的作品"
          rightElement={
            <SettingSelect
              value={localPrivacy.videoVisibility}
              options={visibilityOptions}
              onChange={(v) => handlePrivacyChange('videoVisibility', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="互动权限" description="控制其他用户可以与您进行的互动">
        <SettingItem
          icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
          title="允许评论"
          description="其他用户可以评论您的作品"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowComments}
              onChange={(v) => handlePrivacyChange('allowComments', v)}
            />
          }
        />

        <SettingItem
          icon={<Users className="w-5 h-5 text-gray-400" />}
          title="允许合拍"
          description="其他用户可以与您的作品合拍"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowDuet}
              onChange={(v) => handlePrivacyChange('allowDuet', v)}
            />
          }
        />

        <SettingItem
          icon={<Users className="w-5 h-5 text-gray-400" />}
          title="允许剪同款"
          description="其他用户可以使用您的作品同款特效"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowStitch}
              onChange={(v) => handlePrivacyChange('allowStitch', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="在线状态" description="控制您的活动状态显示">
        <SettingItem
          icon={<Eye className="w-5 h-5 text-gray-400" />}
          title="显示在线状态"
          description="其他用户可以看到您是否在线"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.showOnlineStatus}
              onChange={(v) => handlePrivacyChange('showOnlineStatus', v)}
            />
          }
        />

        <SettingItem
          icon={<Clock className="w-5 h-5 text-gray-400" />}
          title="显示活动状态"
          description="显示您最后活跃的时间"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.showActivityStatus}
              onChange={(v) => handlePrivacyChange('showActivityStatus', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="社交发现" description="控制其他人如何找到您">
        <SettingItem
          icon={<Users className="w-5 h-5 text-gray-400" />}
          title="公开关注列表"
          description="其他人可以查看您的关注列表"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.showFollowList}
              onChange={(v) => handlePrivacyChange('showFollowList', v)}
            />
          }
        />

        <SettingItem
          icon={<Heart className="w-5 h-5 text-gray-400" />}
          title="公开喜欢列表"
          description="其他人可以查看您喜欢的作品"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.showLikeList}
              onChange={(v) => handlePrivacyChange('showLikeList', v)}
            />
          }
        />

        <SettingItem
          icon={<Search className="w-5 h-5 text-gray-400" />}
          title="允许通过手机号搜索"
          description="其他用户可以通过手机号找到您"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowSearchByPhone}
              onChange={(v) => handlePrivacyChange('allowSearchByPhone', v)}
            />
          }
        />

        <SettingItem
          icon={<Search className="w-5 h-5 text-gray-400" />}
          title="允许通过邮箱搜索"
          description="其他用户可以通过邮箱找到您"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowSearchByEmail}
              onChange={(v) => handlePrivacyChange('allowSearchByEmail', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="个性化设置" description="控制内容推荐和广告">
        <SettingItem
          icon={<Target className="w-5 h-5 text-gray-400" />}
          title="个性化推荐"
          description="根据您的行为推荐内容"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.personalizedRecommendations}
              onChange={(v) => handlePrivacyChange('personalizedRecommendations', v)}
            />
          }
        />

        <SettingItem
          icon={<Target className="w-5 h-5 text-gray-400" />}
          title="个性化广告"
          description="根据您的兴趣展示广告"
          rightElement={
            <SettingSwitch
              checked={localPrivacy.personalizedAds}
              onChange={(v) => handlePrivacyChange('personalizedAds', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="账户安全" description="保护您的账户安全">
        <SettingItem
          icon={<Key className="w-5 h-5 text-gray-400" />}
          title="两步验证"
          description="登录时需要额外的验证代码"
          rightElement={
            <SettingSwitch
              checked={localSecurity.twoFactorEnabled}
              onChange={(v) => handleSecurityChange('twoFactorEnabled', v)}
            />
          }
        />

        <SettingItem
          icon={<AlertTriangle className="w-5 h-5 text-gray-400" />}
          title="登录通知"
          description="新设备登录时发送通知"
          rightElement={
            <SettingSwitch
              checked={localSecurity.loginNotifications}
              onChange={(v) => handleSecurityChange('loginNotifications', v)}
            />
          }
        />

        <SettingItem
          icon={<Clock className="w-5 h-5 text-gray-400" />}
          title="会话超时"
          description="自动登出前的空闲天数"
          rightElement={
            <SettingSelect
              value={localSecurity.sessionTimeout.toString()}
              options={[
                { value: '1', label: '1 天' },
                { value: '7', label: '7 天' },
                { value: '30', label: '30 天' },
                { value: '90', label: '90 天' },
              ]}
              onChange={(v) => handleSecurityChange('sessionTimeout', parseInt(v))}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="危险操作" description="请谨慎操作">
        <SettingItem
          icon={<Smartphone className="w-5 h-5 text-gray-400" />}
          title="管理登录设备"
          description="查看和管理所有登录设备"
          rightElement={
            <span className="text-gray-500 text-sm">{localSecurity.allowedDevices.length} 台设备</span>
          }
        />

        <SettingItem
          icon={<Trash2 className="w-5 h-5 text-red-500" />}
          title="删除账户"
          description="永久删除您的账户和所有数据"
          onClick={() => {}}
        />
      </SettingGroup>

      {(isSaving || saveSuccess) && (
        <div className={cn(
          'mt-4 p-3 rounded-xl text-sm text-center',
          isSaving ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
        )}>
          {isSaving ? '保存中...' : '设置已自动保存'}
        </div>
      )}
    </div>
  );
};
