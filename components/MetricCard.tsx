import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  onPress,
  trend,
  trendValue,
}: MetricCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return theme.statusAvailable;
      case "down":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getTrendIcon = (): keyof typeof Feather.glyphMap => {
    switch (trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      default:
        return "minus";
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: (iconColor || theme.primary) + "20" },
          ]}
        >
          <Feather
            name={icon}
            size={20}
            color={iconColor || theme.primary}
          />
        </View>
        {trend && trendValue ? (
          <View style={styles.trendContainer}>
            <Feather name={getTrendIcon()} size={14} color={getTrendColor()} />
            <ThemedText
              type="caption"
              style={[styles.trendText, { color: getTrendColor() }]}
            >
              {trendValue}
            </ThemedText>
          </View>
        ) : null}
      </View>
      <ThemedText type="h2" style={styles.value}>
        {value}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.title, { color: theme.textSecondary }]}
      >
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText
          type="caption"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          {subtitle}
        </ThemedText>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    minWidth: 150,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  trendText: {
    fontWeight: "600",
  },
  value: {
    marginBottom: Spacing.xs,
  },
  title: {
    fontWeight: "500",
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
});
