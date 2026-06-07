import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Globe, Video, Volume2, Gauge, Zap } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SettingGroup } from '@/components/settings/SettingGroup';
import { SettingItem } from '@/components/settings/SettingItem';
import { SettingSwitch } from '@/components/settings/SettingSwitch';
import { SettingSelect } from '@/components/settings/SettingSelect';
import { SettingSlider } from '@/components/settings/SettingSlider';
import type { AppPreferences, ThemeMode, Language, VideoQuality } from '@/types';
import { cn } from '@/lib/utils';

const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: '浅色', icon: <Sun className="w-4 h-4" /> },
  { value: 'dark', label: '深色', icon: <Moon className="w-4 h-4" /> },
  { value: 'system', label: '跟随系统', icon: <Monitor className="w-4 h-4" /> },
];

const languageOptions: { value: Language; label: string }[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' },
];

const qualityOptions: { value: VideoQuality; label: string }[] = [
  { value: 'auto', label: '自动' },
  { value: '360p', label: '流畅 360p' },
  { value: '480p', label: '标清 480p' },
  { value: '720p', label: '高清 720p' },
  { value: '1080p', label: '超清 1080p' },
];

const speedOptions: { value: number; label: string }[] = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x 正常' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

export const PreferencesSettingsPanel = () => {
  const { settings, updatePreferences, isSaving, saveSuccess } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState<AppPreferences>(settings.preferences);

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
      <SettingGroup title="外观" description="自定义应用的视觉效果">
        <SettingItem
          icon={<Globe className="w-5 h-5 text-gray-400" />}
          title="主题模式"
          description="选择您喜欢的显示模式"
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
          title="语言"
          description="选择应用显示语言"
          rightElement={
            <SettingSelect
              value={localSettings.language}
              options={languageOptions}
              onChange={(v) => handleChange('language', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="播放设置" description="视频和音频播放相关选项">
        <SettingItem
          icon={<Video className="w-5 h-5 text-gray-400" />}
          title="默认画质"
          description="视频播放的默认清晰度"
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
          title="播放速度"
          description="默认视频播放速度"
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
          title="自动播放"
          description="Wi-Fi 环境下自动播放视频"
          rightElement={
            <SettingSwitch
              checked={localSettings.autoPlay}
              onChange={(v) => handleChange('autoPlay', v)}
            />
          }
        />

        <SettingItem
          icon={<Zap className="w-5 h-5 text-gray-400" />}
          title="移动网络自动播放"
          description="使用移动数据时也自动播放"
          rightElement={
            <SettingSwitch
              checked={localSettings.autoPlayOnMobile}
              onChange={(v) => handleChange('autoPlayOnMobile', v)}
            />
          }
        />

        <SettingItem
          icon={<Video className="w-5 h-5 text-gray-400" />}
          title="显示字幕"
          description="自动显示视频字幕"
          rightElement={
            <SettingSwitch
              checked={localSettings.showCaptions}
              onChange={(v) => handleChange('showCaptions', v)}
            />
          }
        />
      </SettingGroup>

      <SettingGroup title="音频与触感" description="音量和反馈设置">
        <SettingItem
          icon={<Volume2 className="w-5 h-5 text-gray-400" />}
          title="默认音量"
          description="视频播放的默认音量"
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
          title="触感反馈"
          description="交互时提供震动反馈"
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
          {isSaving ? '保存中...' : '设置已自动保存'}
        </div>
      )}
    </div>
  );
};
