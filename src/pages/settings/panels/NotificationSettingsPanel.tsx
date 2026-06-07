import { useState, useEffect } from 'react';
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

const frequencyOptions: { value: NotificationFrequency; label: string }[] = [
  { value: 'always', label: '始终' },
  { value: 'daily', label: '每日汇总' },
  { value: 'weekly', label: '每周汇总' },
  { value: 'never', label: '从不' },
];

export const NotificationSettingsPanel = () => {
  const { settings, updateNotificationSettings, validateField, errors, isSaving, saveSuccess } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings.notifications);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
        newErrors.quietHours = '开始时间和结束时间不能相同';
      }
    }
    setFieldErrors(newErrors);
  }, [localSettings, touched, validateField]);

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
      <SettingGroup title="通知渠道" description="选择接收通知的方式">
        <SettingItem
          icon={<Bell className="w-5 h-5 text-gray-400" />}
          title="推送通知"
          description="接收应用推送消息"
          rightElement={
            <SettingSwitch
              checked={localSettings.pushEnabled}
              onChange={(v) => handleChange('pushEnabled', v)}
            />
          }
        />

        <SettingItem
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          title="邮件通知"
          description="重要消息通过邮件告知"
          rightElement={
            <SettingSwitch
              checked={localSettings.emailEnabled}
              onChange={(v) => handleChange('emailEnabled', v)}
            />
          }
        />

        <SettingItem
          icon={<Smartphone className="w-5 h-5 text-gray-400" />}
          title="短信通知"
          description="通过短信接收安全提醒"
          rightElement={
            <SettingSwitch
              checked={localSettings.smsEnabled}
              onChange={(v) => handleChange('smsEnabled', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="互动通知" description="管理各类互动消息">
        <SettingItem
          icon={<Heart className="w-5 h-5 text-gray-400" />}
          title="点赞通知"
          description="作品收到点赞时通知"
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
          title="评论通知"
          description="作品收到评论时通知"
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
          title="关注通知"
          description="有新粉丝时通知"
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
          title="私信通知"
          description="收到私信时通知"
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
          title="@ 提醒"
          description="被 @ 时通知"
          rightElement={
            <SettingSelect
              value={localSettings.mentionNotifications}
              options={frequencyOptions}
              onChange={(v) => handleChange('mentionNotifications', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="系统通知" description="官方消息和营销内容">
        <SettingItem
          icon={<AlertCircle className="w-5 h-5 text-gray-400" />}
          title="系统通知"
          description="接收系统公告和功能更新"
          rightElement={
            <SettingSwitch
              checked={localSettings.systemNotifications}
              onChange={(v) => handleChange('systemNotifications', v)}
            />
          }
        />

        <SettingItem
          icon={<Megaphone className="w-5 h-5 text-gray-400" />}
          title="营销通知"
          description="接收活动和推广信息"
          rightElement={
            <SettingSwitch
              checked={localSettings.promotionalNotifications}
              onChange={(v) => handleChange('promotionalNotifications', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="免打扰设置" description="设置安静时段">
        <SettingItem
          icon={<Clock className="w-5 h-5 text-gray-400" />}
          title="启用免打扰"
          description="在指定时段静音所有通知"
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
              <label className="text-gray-400 text-sm mb-2 block">开始时间</label>
              <SettingInput
                type="time"
                value={localSettings.quietHoursStart}
                onChange={(v) => handleTimeChange('quietHoursStart', v)}
                error={fieldErrors.quietHoursStart || fieldErrors.quietHours}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">结束时间</label>
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
              {isSaving ? '保存中...' : '保存免打扰设置'}
            </button>
          </div>
        )}
      </SettingGroup>

      {(isSaving || saveSuccess) && (
        <div className={cn(
          'mt-4 p-3 rounded-xl text-sm text-center',
          isSaving ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
        )}>
          {isSaving ? '保存中...' : '设置已自动保存'}
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
