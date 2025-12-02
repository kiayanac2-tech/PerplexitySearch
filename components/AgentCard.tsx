import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Agent } from "@/lib/storage";

interface AgentCardProps {
  agent: Agent;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AVATAR_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#EA580C",
  "#16A34A",
  "#0891B2",
];

export function AgentCard({ agent, onPress }: AgentCardProps) {
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

  const avatarColor = AVATAR_COLORS[agent.avatarIndex % AVATAR_COLORS.length];
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <ThemedText style={styles.avatarText}>{initials}</ThemedText>
      </View>
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <ThemedText type="body" style={styles.name}>
            {agent.name}
          </ThemedText>
          <StatusBadge status={agent.status} size="small" />
        </View>
        <ThemedText
          type="small"
          style={[styles.employeeId, { color: theme.textSecondary }]}
        >
          {agent.employeeId} - {agent.department}
        </ThemedText>
        {agent.currentTask ? (
          <View style={styles.taskRow}>
            <Feather name="phone" size={12} color={theme.statusBusy} />
            <ThemedText
              type="caption"
              style={[styles.taskText, { color: theme.statusBusy }]}
              numberOfLines={1}
            >
              {agent.currentTask}
            </ThemedText>
          </View>
        ) : null}
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  name: {
    fontWeight: "600",
  },
  employeeId: {},
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  taskText: {
    flex: 1,
  },
});
