import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Mail,
  Smartphone,
  Megaphone,
  AlertCircle,
  Clock,
  AtSign,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SettingGroup } from '@/components/settings/SettingGroup';
import { SettingItem } from '@/components/settings/SettingItem';
import { SettingSwitch } from '@/components/settings/SettingSwitch';
import { SettingSelect } from '@/components/settings/SettingSelect';
import { SettingInput } from '@/components/settings/SettingInput';
import type { NotificationSettings, NotificationFrequency } from '@/types';
import { cn } from '@/lib/utils';

export const NotificationSettingsPanel = () => {
  const { t } = useTranslation();
  const { settings, updateNotificationSettings, validateField, errors, isSaving, saveSuccess } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings.notifications);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const frequencyOptions = useMemo<{ value: NotificationFrequency; label: string }[]>(() => [
    { value: 'always', label: t('settings.always') },
    { value: 'daily', label: t('settings.daily') },
    { value: 'weekly', label: t('settings.weekly') },
    { value: 'never', label: t('settings.never') },
  ], [t]);

  useEffect(() => {
    setLocalSettings(settings.notifications);
  }, [settings.notifications]);

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    const fields = ['quietHoursStart', 'quietHoursEnd'] as const;
    for (const field of fields) {
      if (touched[field]) {
        const error = validateField(field, localSettings[field]);
        if (error) {
          newErrors[field] = error.message;
        }
      }
    }
    if (localSettings.quietHoursEnabled && localSettings.quietHoursStart && localSettings.quietHoursEnd) {
      if (localSettings.quietHoursStart === localSettings.quietHoursEnd) {
        newErrors.quietHours = t('validation.quietHoursSameTime');
      }
    }
    setFieldErrors(newErrors);
  }, [localSettings, touched, validateField, t]);

  const handleChange = async <K extends keyof NotificationSettings>(
    field: K,
    value: NotificationSettings[K]
  ) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field as string]: true }));

    if (!['quietHoursStart', 'quietHoursEnd', 'quietHoursEnabled'].includes(field as string)) {
      await updateNotificationSettings({ [field]: value });
    }
  };

  const handleTimeChange = (field: 'quietHoursStart' | 'quietHoursEnd', value: string) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const saveQuietHours = async () => {
    const hasError = Object.keys(fieldErrors).length > 0;
    if (hasError) return;

    await updateNotificationSettings({
      quietHoursEnabled: localSettings.quietHoursEnabled,
      quietHoursStart: localSettings.quietHoursStart,
      quietHoursEnd: localSettings.quietHoursEnd,
    });
  };

  const hasQuietHoursChanges =
    localSettings.quietHoursEnabled !== settings.notifications.quietHoursEnabled ||
    localSettings.quietHoursStart !== settings.notifications.quietHoursStart ||
    localSettings.quietHoursEnd !== settings.notifications.quietHoursEnd;

  const hasAnyErrors = Object.keys(fieldErrors).length > 0;

  return (
    <div>
      <SettingGroup title={t('settings.notificationsTitle')} description={t('settings.notificationsDesc')}>
        <SettingItem
          icon={<Bell className="w-5 h-5 text-gray-400" />}
          title={t('settings.pushNotifications')}
          description={t('settings.pushNotificationsDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.pushEnabled}
              onChange={(v) => handleChange('pushEnabled', v)}
            />
          }
        />

        <SettingItem
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          title={t('settings.emailNotifications')}
          description={t('settings.emailNotificationsDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.emailEnabled}
              onChange={(v) => handleChange('emailEnabled', v)}
            />
          }
        />

        <SettingItem
          icon={<Smartphone className="w-5 h-5 text-gray-400" />}
          title={t('settings.smsNotifications')}
          description={t('settings.smsNotificationsDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.smsEnabled}
              onChange={(v) => handleChange('smsEnabled', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.interactionNotifications')} description={t('settings.interactionNotificationsDesc')}>
        <SettingItem
          icon={<Heart className="w-5 h-5 text-gray-400" />}
          title={t('settings.likeNotifications')}
          description={t('settings.likeNotificationsDesc')}
          rightElement={
            <SettingSelect
              value={localSettings.likeNotifications}
              options={frequencyOptions}
              onChange={(v) => handleChange('likeNotifications', v)}
            />
          }
        />

        <SettingItem
          icon={<MessageCircle className="w-5 h-5 text-gray-400" />}
          title={t('settings.commentNotifications')}
          description={t('settings.commentNotificationsDesc')}
          rightElement={
            <SettingSelect
              value={localSettings.commentNotifications}
              options={frequencyOptions}
              onChange={(v) => handleChange('commentNotifications', v)}
            />
          }
        />

        <SettingItem
          icon={<UserPlus className="w-5 h-5 text-gray-400" />}
          title={t('settings.followNotifications')}
          description={t('settings.followNotificationsDesc')}
          rightElement={
            <SettingSelect
              value={localSettings.followNotifications}
              options={frequencyOptions}
              onChange={(v) => handleChange('followNotifications', v)}
            />
          }
        />

        <SettingItem
          icon={<MessageCircle className="w-5 h-5 text-gray-400" />}
          title={t('settings.messageNotifications')}
          description={t('settings.messageNotificationsDesc')}
          rightElement={
            <SettingSelect
              value={localSettings.messageNotifications}
              options={frequencyOptions}
              onChange={(v) => handleChange('messageNotifications', v)}
            />
          }
        />

        <SettingItem
          icon={<AtSign className="w-5 h-5 text-gray-400" />}
          title={t('settings.mentionNotifications')}
          description={t('settings.mentionNotificationsDesc')}
          rightElement={
            <SettingSelect
              value={localSettings.mentionNotifications}
              options={frequencyOptions}
              onChange={(v) => handleChange('mentionNotifications', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.systemNotificationsTitle')} description={t('settings.systemNotificationsDesc')}>
        <SettingItem
          icon={<AlertCircle className="w-5 h-5 text-gray-400" />}
          title={t('settings.systemNotifications')}
          description={t('settings.systemNotificationsDesc2')}
          rightElement={
            <SettingSwitch
              checked={localSettings.systemNotifications}
              onChange={(v) => handleChange('systemNotifications', v)}
            />
          }
        />

        <SettingItem
          icon={<Megaphone className="w-5 h-5 text-gray-400" />}
          title={t('settings.promotionalNotifications')}
          description={t('settings.promotionalNotificationsDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.promotionalNotifications}
              onChange={(v) => handleChange('promotionalNotifications', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.quietHours')} description={t('settings.quietHoursDesc')}>
        <SettingItem
          icon={<Clock className="w-5 h-5 text-gray-400" />}
          title={t('settings.quietHoursEnable')}
          description={t('settings.quietHoursEnableDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.quietHoursEnabled}
              onChange={(v) => handleTimeChange('quietHoursEnabled' as 'quietHoursStart', v as unknown as string)}
            />
          }
        />

        {localSettings.quietHoursEnabled && (
          <div className="pt-4 space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('settings.startTime')}</label>
              <SettingInput
                type="time"
                value={localSettings.quietHoursStart}
                onChange={(v) => handleTimeChange('quietHoursStart', v)}
                error={fieldErrors.quietHoursStart || fieldErrors.quietHours}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('settings.endTime')}</label>
              <SettingInput
                type="time"
                value={localSettings.quietHoursEnd}
                onChange={(v) => handleTimeChange('quietHoursEnd', v)}
                error={fieldErrors.quietHoursEnd || fieldErrors.quietHours}
              />
            </div>

            <button
              type="button"
              onClick={saveQuietHours}
              disabled={!hasQuietHoursChanges || hasAnyErrors || isSaving}
              className={cn(
                'w-full py-3 rounded-xl font-medium text-sm transition-all',
                hasQuietHoursChanges && !hasAnyErrors && !isSaving
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              )}
            >
              {isSaving ? t('common.saving') : t('settings.saveQuietHours')}
            </button>
          </div>
        )}
      </SettingGroup>

      {(isSaving || saveSuccess) && (
        <div className={cn(
          'mt-4 p-3 rounded-xl text-sm text-center',
          isSaving ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
        )}>
          {isSaving ? t('common.saving') : t('settings.saveSuccess')}
        </div>
      )}

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
