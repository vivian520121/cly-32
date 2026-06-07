import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Monitor, Globe, Video, Volume2, Gauge, Zap } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SettingGroup } from '@/components/settings/SettingGroup';
import { SettingItem } from '@/components/settings/SettingItem';
import { SettingSwitch } from '@/components/settings/SettingSwitch';
import { SettingSelect } from '@/components/settings/SettingSelect';
import { SettingSlider } from '@/components/settings/SettingSlider';
import type { AppPreferences, ThemeMode, Language, VideoQuality } from '@/types';
import { cn } from '@/lib/utils';

export const PreferencesSettingsPanel = () => {
  const { t } = useTranslation();
  const { settings, updatePreferences, isSaving, saveSuccess } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState<AppPreferences>(settings.preferences);

  const themeOptions = useMemo<{ value: ThemeMode; label: string; icon: React.ReactNode }[]>(() => [
    { value: 'light', label: t('settings.light'), icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: t('settings.dark'), icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: t('settings.system'), icon: <Monitor className="w-4 h-4" /> },
  ], [t]);

  const languageOptions = useMemo<{ value: Language; label: string }[]>(() => [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en-US', label: 'English' },
    { value: 'ja-JP', label: '日本語' },
  ], []);

  const qualityOptions = useMemo<{ value: VideoQuality; label: string }[]>(() => [
    { value: 'auto', label: t('settings.auto') },
    { value: '360p', label: '流畅 360p' },
    { value: '480p', label: '标清 480p' },
    { value: '720p', label: '高清 720p' },
    { value: '1080p', label: '超清 1080p' },
  ], [t]);

  const speedOptions = useMemo<{ value: number; label: string }[]>(() => [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x Normal' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
  ], []);

  useEffect(() => {
    setLocalSettings(settings.preferences);
  }, [settings.preferences]);

  const handleChange = async <K extends keyof AppPreferences>(
    field: K,
    value: AppPreferences[K]
  ) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
    await updatePreferences({ [field]: value });
  };

  return (
    <div>
      <SettingGroup title={t('settings.appearance')} description={t('settings.appearanceDesc')}>
        <SettingItem
          icon={<Globe className="w-5 h-5 text-gray-400" />}
          title={t('settings.theme')}
          description={t('settings.themeDesc')}
          rightElement={
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('theme', option.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors',
                    localSettings.theme === option.value
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          }
        />

        <SettingItem
          icon={<Globe className="w-5 h-5 text-gray-400" />}
          title={t('settings.language')}
          description={t('settings.languageDesc')}
          rightElement={
            <SettingSelect
              value={localSettings.language}
              options={languageOptions}
              onChange={(v) => handleChange('language', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.playback')} description={t('settings.playbackDesc')}>
        <SettingItem
          icon={<Video className="w-5 h-5 text-gray-400" />}
          title={t('settings.videoQuality')}
          description={t('settings.videoQualityDesc')}
          rightElement={
            <SettingSelect
              value={localSettings.videoQuality}
              options={qualityOptions}
              onChange={(v) => handleChange('videoQuality', v)}
            />
          }
        />

        <SettingItem
          icon={<Gauge className="w-5 h-5 text-gray-400" />}
          title={t('settings.playbackSpeed')}
          description={t('settings.playbackSpeedDesc')}
          rightElement={
            <SettingSelect
              value={localSettings.playbackSpeed}
              options={speedOptions}
              onChange={(v) => handleChange('playbackSpeed', v)}
            />
          }
        />

        <SettingItem
          icon={<Video className="w-5 h-5 text-gray-400" />}
          title={t('settings.autoplay')}
          description={t('settings.autoplayDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.autoPlay}
              onChange={(v) => handleChange('autoPlay', v)}
            />
          }
        />

        <SettingItem
          icon={<Zap className="w-5 h-5 text-gray-400" />}
          title={t('settings.autoplayMobile')}
          description={t('settings.autoplayMobileDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.autoPlayOnMobile}
              onChange={(v) => handleChange('autoPlayOnMobile', v)}
            />
          }
        />

        <SettingItem
          icon={<Video className="w-5 h-5 text-gray-400" />}
          title={t('settings.showCaptions')}
          description={t('settings.showCaptionsDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.showCaptions}
              onChange={(v) => handleChange('showCaptions', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title={t('settings.audio')} description={t('settings.audioDesc')}>
        <SettingItem
          icon={<Volume2 className="w-5 h-5 text-gray-400" />}
          title={t('settings.defaultVolume')}
          description={t('settings.defaultVolumeDesc')}
          bordered={false}
        />
        <div className="py-4">
          <SettingSlider
            value={localSettings.volume}
            onChange={(v) => handleChange('volume', v)}
            unit="%"
          />
        </div>

        <SettingItem
          icon={<Zap className="w-5 h-5 text-gray-400" />}
          title={t('settings.hapticFeedback')}
          description={t('settings.hapticFeedbackDesc')}
          rightElement={
            <SettingSwitch
              checked={localSettings.enableHapticFeedback}
              onChange={(v) => handleChange('enableHapticFeedback', v)}
            />
          }
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
