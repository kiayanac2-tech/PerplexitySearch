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
import { JobPosting } from "@/lib/storage";

interface JobCardProps {
  job: JobPosting;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function JobCard({ job, onPress }: JobCardProps) {
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

  const getTypeColor = () => {
    switch (job.type) {
      case "full-time":
        return theme.statusAvailable;
      case "part-time":
        return theme.primary;
      case "contract":
        return theme.accent;
      default:
        return theme.textSecondary;
    }
  };

  const getTypeLabel = () => {
    switch (job.type) {
      case "full-time":
        return "Full-time";
      case "part-time":
        return "Part-time";
      case "contract":
        return "Contract";
      default:
        return job.type;
    }
  };

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

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
      <View style={styles.header}>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getTypeColor() + "20" },
          ]}
        >
          <ThemedText
            type="caption"
            style={[styles.typeText, { color: getTypeColor() }]}
          >
            {getTypeLabel()}
          </ThemedText>
        </View>
        {job.isActive ? (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: theme.statusAvailable + "20" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: theme.statusAvailable },
              ]}
            />
            <ThemedText
              type="caption"
              style={{ color: theme.statusAvailable }}
            >
              Active
            </ThemedText>
          </View>
        ) : (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: theme.statusOffline + "20" },
            ]}
          >
            <ThemedText type="caption" style={{ color: theme.statusOffline }}>
              Closed
            </ThemedText>
          </View>
        )}
      </View>

      <ThemedText type="h4" style={styles.title} numberOfLines={2}>
        {job.title}
      </ThemedText>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Feather name="map-pin" size={14} color={theme.textSecondary} />
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary }}
            numberOfLines={1}
          >
            {job.location}
          </ThemedText>
        </View>
        <View style={styles.infoItem}>
          <Feather name="dollar-sign" size={14} color={theme.textSecondary} />
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary }}
            numberOfLines={1}
          >
            {job.salary}
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.applicantsRow}>
          <Feather name="users" size={14} color={theme.primary} />
          <ThemedText type="small" style={{ color: theme.primary }}>
            {job.applicationsCount} applicants
          </ThemedText>
        </View>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  typeText: {
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  applicantsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
});
