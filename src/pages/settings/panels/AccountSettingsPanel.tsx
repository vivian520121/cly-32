import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, FileText, Camera, Check } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SettingGroup } from '@/components/settings/SettingGroup';
import { SettingItem } from '@/components/settings/SettingItem';
import { SettingInput } from '@/components/settings/SettingInput';
import type { AccountSettings } from '@/types';
import { cn } from '@/lib/utils';

export const AccountSettingsPanel = () => {
  const { t } = useTranslation();
  const { settings, updateAccountSettings, validateField, clearErrors, errors, isSaving } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState<AccountSettings>(settings.account);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalSettings(settings.account);
  }, [settings.account]);

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    for (const [field, value] of Object.entries(localSettings)) {
      if (touched[field]) {
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error.message;
        }
      }
    }
    setFieldErrors(newErrors);
  }, [localSettings, touched, validateField]);

  const handleChange = (field: keyof AccountSettings, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof AccountSettings) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    setTouched({
      username: true,
      nickname: true,
      bio: true,
      email: true,
      phone: true,
    });

    const hasErrors = Object.keys(localSettings).some((field) => {
      const error = validateField(field, localSettings[field as keyof AccountSettings]);
      return error !== null;
    });

    if (hasErrors) {
      return;
    }

    clearErrors();
    await updateAccountSettings(localSettings);
  };

  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings.account);
  const hasAnyErrors = Object.keys(fieldErrors).length > 0;

  return (
    <div>
      <SettingGroup title={t('settings.accountInfo')} description={t('settings.accountDesc')}>
        <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-800">
          <div className="relative">
            <img
              src={localSettings.avatar}
              alt={t('settings.avatar')}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">{t('settings.changeAvatar')}</p>
        </div>

        <SettingItem
          icon={<User className="w-5 h-5 text-gray-400" />}
          title={t('settings.username')}
          bordered={false}
          className="mb-4"
        />
        <SettingInput
          value={localSettings.username}
          onChange={(v) => handleChange('username', v)}
          onBlur={() => handleBlur('username')}
          placeholder={t('settings.usernamePlaceholder')}
          error={fieldErrors.username}
          maxLength={20}
          showCount
          className="mb-4"
        />

        <SettingItem
          icon={<User className="w-5 h-5 text-gray-400" />}
          title={t('settings.nickname')}
          bordered={false}
          className="mb-4"
        />
        <SettingInput
          value={localSettings.nickname}
          onChange={(v) => handleChange('nickname', v)}
          onBlur={() => handleBlur('nickname')}
          placeholder={t('settings.nicknamePlaceholder')}
          error={fieldErrors.nickname}
          maxLength={30}
          showCount
          className="mb-4"
        />

        <SettingItem
          icon={<FileText className="w-5 h-5 text-gray-400" />}
          title={t('settings.bio')}
          bordered={false}
          className="mb-4"
        />
        <SettingInput
          value={localSettings.bio}
          onChange={(v) => handleChange('bio', v)}
          onBlur={() => handleBlur('bio')}
          placeholder={t('settings.bioPlaceholder')}
          error={fieldErrors.bio}
          maxLength={200}
          showCount
          className="mb-4"
        />

        <SettingItem
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          title={t('settings.email')}
          bordered={false}
          className="mb-4"
        />
        <SettingInput
          type="email"
          value={localSettings.email}
          onChange={(v) => handleChange('email', v)}
          onBlur={() => handleBlur('email')}
          placeholder={t('settings.emailPlaceholder')}
          error={fieldErrors.email}
          className="mb-4"
        />

        <SettingItem
          icon={<Phone className="w-5 h-5 text-gray-400" />}
          title={t('settings.phone')}
          bordered={false}
          className="mb-4"
        />
        <SettingInput
          type="tel"
          value={localSettings.phone}
          onChange={(v) => handleChange('phone', v)}
          onBlur={() => handleBlur('phone')}
          placeholder={t('settings.phonePlaceholder')}
          error={fieldErrors.phone}
          className="mb-4"
        />
      </SettingGroup>

      <button
        type="button"
        onClick={handleSave}
        disabled={!hasChanges || hasAnyErrors || isSaving}
        className={cn(
          'w-full py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2',
          hasChanges && !hasAnyErrors && !isSaving
            ? 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        )}
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('common.saving')}
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            {t('settings.saveChanges')}
          </>
        )}
      </button>

      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          {errors.map((err, i) => (
            <p key={i} className="text-red-500 text-sm">{err.message}</p>
          ))}
        </div>
      )}
    </div>
  );
};
