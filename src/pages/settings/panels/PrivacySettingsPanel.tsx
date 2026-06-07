import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

export const PrivacySettingsPanel = () => {
  const { t } = useTranslation();
  const { settings, updatePrivacySettings, updateSecuritySettings, isSaving, saveSuccess } = useSettingsStore();
  const [localPrivacy, setLocalPrivacy] = useState<PrivacySettings>(settings.privacy);
  const [localSecurity, setLocalSecurity] = useState<SecuritySettings>(settings.security);

  const visibilityOptions = useMemo<{ value: 'public' | 'followers' | 'private'; label: string }[]>(() => [
    { value: 'public', label: t('settings.public') },
    { value: 'followers', label: t('settings.followersOnly') },
    { value: 'private', label: t('settings.private') },
  ], [t]);

  const sessionTimeoutOptions = useMemo(() => [
    { value: '1', label: t('settings.oneDay') },
    { value: '7', label: t('settings.sevenDays') },
    { value: '30', label: t('settings.thirtyDays') },
    { value: '90', label: t('settings.ninetyDays') },
  ], [t]);

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
      <SettingGroup title={t('settings.visibility')} description={t('settings.visibilityDesc')}>
        <SettingItem
          icon={<Eye className="w-5 h-5 text-gray-400" />}
          title={t('settings.profileVisibility')}
          description={t('settings.profileVisibilityDesc')}
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
          title={t('settings.videoVisibility')}
          description={t('settings.videoVisibilityDesc')}
          rightElement={
            <SettingSelect
              value={localPrivacy.videoVisibility}
              options={visibilityOptions}
              onChange={(v) => handlePrivacyChange('videoVisibility', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.interactionPermissions')} description={t('settings.interactionPermissionsDesc')}>
        <SettingItem
          icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
          title={t('settings.allowComments')}
          description={t('settings.allowCommentsDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowComments}
              onChange={(v) => handlePrivacyChange('allowComments', v)}
            />
          }
        />

        <SettingItem
          icon={<Users className="w-5 h-5 text-gray-400" />}
          title={t('settings.allowDuet')}
          description={t('settings.allowDuetDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowDuet}
              onChange={(v) => handlePrivacyChange('allowDuet', v)}
            />
          }
        />

        <SettingItem
          icon={<Users className="w-5 h-5 text-gray-400" />}
          title={t('settings.allowStitch')}
          description={t('settings.allowStitchDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowStitch}
              onChange={(v) => handlePrivacyChange('allowStitch', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.onlineStatus')} description={t('settings.onlineStatusDesc')}>
        <SettingItem
          icon={<Eye className="w-5 h-5 text-gray-400" />}
          title={t('settings.showOnlineStatus')}
          description={t('settings.showOnlineStatusDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.showOnlineStatus}
              onChange={(v) => handlePrivacyChange('showOnlineStatus', v)}
            />
          }
        />

        <SettingItem
          icon={<Clock className="w-5 h-5 text-gray-400" />}
          title={t('settings.showActivityStatus')}
          description={t('settings.showActivityStatusDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.showActivityStatus}
              onChange={(v) => handlePrivacyChange('showActivityStatus', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.socialDiscovery')} description={t('settings.socialDiscoveryDesc')}>
        <SettingItem
          icon={<Users className="w-5 h-5 text-gray-400" />}
          title={t('settings.showFollowList')}
          description={t('settings.showFollowListDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.showFollowList}
              onChange={(v) => handlePrivacyChange('showFollowList', v)}
            />
          }
        />

        <SettingItem
          icon={<Heart className="w-5 h-5 text-gray-400" />}
          title={t('settings.showLikeList')}
          description={t('settings.showLikeListDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.showLikeList}
              onChange={(v) => handlePrivacyChange('showLikeList', v)}
            />
          }
        />

        <SettingItem
          icon={<Search className="w-5 h-5 text-gray-400" />}
          title={t('settings.allowSearchByPhone')}
          description={t('settings.allowSearchByPhoneDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowSearchByPhone}
              onChange={(v) => handlePrivacyChange('allowSearchByPhone', v)}
            />
          }
        />

        <SettingItem
          icon={<Search className="w-5 h-5 text-gray-400" />}
          title={t('settings.allowSearchByEmail')}
          description={t('settings.allowSearchByEmailDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.allowSearchByEmail}
              onChange={(v) => handlePrivacyChange('allowSearchByEmail', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.personalization')} description={t('settings.personalizationDesc')}>
        <SettingItem
          icon={<Target className="w-5 h-5 text-gray-400" />}
          title={t('settings.personalizedRecommendations')}
          description={t('settings.personalizedRecommendationsDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.personalizedRecommendations}
              onChange={(v) => handlePrivacyChange('personalizedRecommendations', v)}
            />
          }
        />

        <SettingItem
          icon={<Target className="w-5 h-5 text-gray-400" />}
          title={t('settings.personalizedAds')}
          description={t('settings.personalizedAdsDesc')}
          rightElement={
            <SettingSwitch
              checked={localPrivacy.personalizedAds}
              onChange={(v) => handlePrivacyChange('personalizedAds', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.accountSecurity')} description={t('settings.accountSecurityDesc')}>
        <SettingItem
          icon={<Key className="w-5 h-5 text-gray-400" />}
          title={t('settings.twoFactor')}
          description={t('settings.twoFactorDesc')}
          rightElement={
            <SettingSwitch
              checked={localSecurity.twoFactorEnabled}
              onChange={(v) => handleSecurityChange('twoFactorEnabled', v)}
            />
          }
        />

        <SettingItem
          icon={<AlertTriangle className="w-5 h-5 text-gray-400" />}
          title={t('settings.loginNotifications')}
          description={t('settings.loginNotificationsDesc')}
          rightElement={
            <SettingSwitch
              checked={localSecurity.loginNotifications}
              onChange={(v) => handleSecurityChange('loginNotifications', v)}
            />
          }
        />

        <SettingItem
          icon={<Clock className="w-5 h-5 text-gray-400" />}
          title={t('settings.sessionTimeout')}
          description={t('settings.sessionTimeoutDesc')}
          rightElement={
            <SettingSelect
              value={localSecurity.sessionTimeout.toString()}
              options={sessionTimeoutOptions}
              onChange={(v) => handleSecurityChange('sessionTimeout', parseInt(v))}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.dangerousActions')} description={t('settings.dangerousActionsDesc')}>
        <SettingItem
          icon={<Smartphone className="w-5 h-5 text-gray-400" />}
          title={t('settings.manageDevices')}
          description={t('settings.manageDevicesDesc')}
          rightElement={
            <span className="text-gray-500 text-sm">{t('settings.devicesCount', { count: localSecurity.allowedDevices.length })}</span>
          }
        />

        <SettingItem
          icon={<Trash2 className="w-5 h-5 text-red-500" />}
          title={t('settings.deleteAccount')}
          description={t('settings.deleteAccountDesc')}
          onClick={() => {}}
        />
      </SettingGroup>

      {(isSaving || saveSuccess) && (
        <div className={cn(
          'mt-4 p-3 rounded-xl text-sm text-center',
          isSaving ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
        )}>
          {isSaving ? t('common.saving') : t('settings.saveSuccess')}
        </div>
      )}
    </div>
  );
};
