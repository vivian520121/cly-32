import { useTranslation } from 'react-i18next';
import { Info, Star, Share2, FileText, Shield, HelpCircle, MessageSquare } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SettingGroup } from '@/components/settings/SettingGroup';
import { SettingItem } from '@/components/settings/SettingItem';

export const AboutPanel = () => {
  const { t } = useTranslation();
  const { settings } = useSettingsStore();

  const appInfo = {
    version: '1.0.0',
    buildNumber: '20240101',
    lastUpdated: new Date(settings.updatedAt).toLocaleDateString('zh-CN'),
  };

  return (
    <div>
      <SettingGroup title={t('settings.aboutTitle')}>
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">短</span>
          </div>
          <h2 className="text-white font-bold text-xl">短视频</h2>
          <p className="text-gray-500 text-sm mt-1">版本 {appInfo.version}</p>
          <p className="text-gray-600 text-xs mt-1">Build {appInfo.buildNumber}</p>
          <p className="text-gray-600 text-xs mt-1">{t('settings.settingsLastUpdated', { date: appInfo.lastUpdated })}</p>
        </div>
      </SettingGroup>

      <SettingGroup title={t('settings.rateUs')} description={t('settings.rateUsDesc')}>
        <SettingItem
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          title="评分与评价"
          description="分享您的使用体验"
          onClick={() => {}}
        />
      </SettingGroup>

      <SettingGroup title={t('settings.share')} description={t('settings.shareDesc')}>
        <SettingItem
          icon={<Share2 className="w-5 h-5 text-blue-500" />}
          title={t('settings.shareApp')}
          description={t('settings.shareAppDesc')}
          onClick={() => {}}
        />
      </SettingGroup>

      <SettingGroup title={t('settings.legal')}>
        <SettingItem
          icon={<FileText className="w-5 h-5 text-gray-400" />}
          title={t('settings.userAgreement')}
          description={t('settings.userAgreementDesc')}
          onClick={() => {}}
        />
        <SettingItem
          icon={<Shield className="w-5 h-5 text-gray-400" />}
          title={t('settings.privacyPolicy')}
          description={t('settings.privacyPolicyDesc')}
          onClick={() => {}}
        />
      </SettingGroup>

      <SettingGroup title={t('settings.help')}>
        <SettingItem
          icon={<HelpCircle className="w-5 h-5 text-gray-400" />}
          title={t('settings.helpCenter')}
          description={t('settings.helpCenterDesc')}
          onClick={() => {}}
        />
        <SettingItem
          icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
          title={t('settings.contactSupport')}
          description={t('settings.contactSupportDesc')}
          onClick={() => {}}
        />
        <SettingItem
          icon={<Info className="w-5 h-5 text-gray-400" />}
          title={t('settings.aboutUs')}
          description={t('settings.aboutUsDesc')}
          onClick={() => {}}
        />
      </SettingGroup>

      <div className="text-center py-8">
        <p className="text-gray-600 text-xs">{t('settings.copyright')}</p>
        <p className="text-gray-700 text-xs mt-2">{t('settings.madeWith')}</p>
      </div>
    </div>
  );
};
