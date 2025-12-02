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
import { TrainingModule } from "@/lib/storage";

interface TrainingCardProps {
  module: TrainingModule;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CATEGORY_CONFIG: Record<
  TrainingModule["category"],
  { icon: keyof typeof Feather.glyphMap; color: string }
> = {
  onboarding: { icon: "user-plus", color: "#2563EB" },
  product: { icon: "box", color: "#7C3AED" },
  communication: { icon: "message-circle", color: "#0891B2" },
  compliance: { icon: "shield", color: "#DC2626" },
  advanced: { icon: "award", color: "#CA8A04" },
};

export function TrainingCard({ module, onPress }: TrainingCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const config = CATEGORY_CONFIG[module.category];
  const categoryLabel =
    module.category.charAt(0).toUpperCase() + module.category.slice(1);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <View
          style={[styles.iconContainer, { backgroundColor: config.color + "20" }]}
        >
          <Feather name={config.icon} size={20} color={config.color} />
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <ThemedText type="body" style={styles.title} numberOfLines={2}>
              {module.title}
            </ThemedText>
            {module.isRequired ? (
              <View
                style={[
                  styles.requiredBadge,
                  { backgroundColor: theme.error + "20" },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{ color: theme.error, fontWeight: "600" }}
                >
                  Required
                </ThemedText>
              </View>
            ) : null}
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={12} color={theme.textSecondary} />
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                {module.duration}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Feather name="tag" size={12} color={config.color} />
              <ThemedText type="caption" style={{ color: config.color }}>
                {categoryLabel}
              </ThemedText>
            </View>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: config.color,
                width: `${module.completionRate}%`,
              },
            ]}
          />
        </View>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {module.completionRate}% completed
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    fontWeight: "600",
    flex: 1,
  },
  requiredBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
