import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

// Heights in dp extracted from Figma — 24 bars
export const WAVEFORM_HEIGHTS = [27, 21, 17, 21, 27, 27, 21, 17, 21, 27, 27, 21, 17, 21, 27, 27, 21, 17, 21, 27, 21, 15, 11, 17] as const;

// ─── Pure visual layer ────────────────────────────────────────────────────────
// Showcase imports this to render static states without audio logic.
// All colors/sizes live here — change once, updates everywhere.

type AudioPlayerViewProps = {
  isPlaying: boolean;
  progress: number; // 0–1
  onToggle?: () => void;
};

export function AudioPlayerView({ isPlaying, progress, onToggle }: AudioPlayerViewProps) {
  const filledCount = Math.round(progress * WAVEFORM_HEIGHTS.length);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onToggle}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause audio' : 'Play audio'}
        style={({ pressed }) => [
          styles.playButton,
          pressed && styles.playButtonPressed,
        ]}
      >
        <Icon
          name={isPlaying ? 'pause' : 'play_arrow'}
          size={24}
          color={Colors.text.negative}
        />
      </Pressable>

      <View
        style={styles.waveform}
        accessibilityRole="progressbar"
        accessibilityValue={{ now: Math.round(progress * 100), min: 0, max: 100 }}
      >
        {WAVEFORM_HEIGHTS.map((height, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              { height },
              index < filledCount ? styles.barFilled : styles.barEmpty,
            ]}
          />
        ))}
      </View>

      <Pressable
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Playback speed 1x"
        style={styles.speedButton}
      >
        <Text style={styles.speedText}>1x</Text>
      </Pressable>
    </View>
  );
}

// ─── Audio logic layer ────────────────────────────────────────────────────────

type AudioPlayerProps = {
  // URI string for network audio or require() module ID for local assets
  audioUrl: string | number;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
};

export default function AudioPlayer({ audioUrl, onPlayStart, onPlayEnd }: AudioPlayerProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const onPlayStartRef = useRef(onPlayStart);
  const onPlayEndRef = useRef(onPlayEnd);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => { onPlayStartRef.current = onPlayStart; }, [onPlayStart]);
  useEffect(() => { onPlayEndRef.current = onPlayEnd; }, [onPlayEnd]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const source = typeof audioUrl === 'string' ? { uri: audioUrl } : audioUrl;
        const { sound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: false },
          (status: AVPlaybackStatus) => {
            if (!status.isLoaded || !mounted) return;
            if (status.durationMillis && status.durationMillis > 0) {
              setProgress(status.positionMillis / status.durationMillis);
            }
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setProgress(1);
              setIsPlaying(false);
              onPlayEndRef.current?.();
            }
          },
        );
        if (mounted) {
          soundRef.current = sound;
        } else {
          sound.unloadAsync();
        }
      } catch (e) {
        console.error('[AudioPlayer] Failed to load:', e);
      }
    }

    load();

    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, [audioUrl]);

  async function togglePlayPause() {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;
      if (status.isPlaying) {
        await sound.pauseAsync();
      } else {
        const atEnd =
          status.didJustFinish ||
          (status.durationMillis != null && status.positionMillis >= status.durationMillis);
        if (atEnd) {
          await sound.setPositionAsync(0);
          setProgress(0);
        }
        await sound.playAsync();
        onPlayStartRef.current?.();
      }
    } catch (e) {
      console.error('[AudioPlayer] Playback error:', e);
    }
  }

  return <AudioPlayerView isPlaying={isPlaying} progress={progress} onToggle={togglePlayPause} />;
}

// ─── Styles (single source of truth) ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonPressed: {
    backgroundColor: Colors.secondary.surfaceHover,
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
  },
  bar: {
    flex: 1,
    borderRadius: 10,
  },
  barFilled: {
    backgroundColor: Colors.secondary.surface,
  },
  barEmpty: {
    backgroundColor: 'rgba(177, 177, 177, 0.5)',
  },
  speedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  speedText: {
    ...Typography.english.body.m,
    color: Colors.text.body,
    fontSize: 12,
  },
});
