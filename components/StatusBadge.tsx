import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { AgentStatus } from "@/lib/storage";

interface StatusBadgeProps {
  status: AgentStatus;
  size?: "small" | "medium";
}

const STATUS_LABELS: Record<AgentStatus, string> = {
  available: "Available",
  busy: "Busy",
  break: "On Break",
  offline: "Offline",
};

export function StatusBadge({ status, size = "medium" }: StatusBadgeProps) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return theme.statusAvailable;
      case "busy":
        return theme.statusBusy;
      case "break":
        return theme.statusBreak;
      case "offline":
        return theme.statusOffline;
      default:
        return theme.statusOffline;
    }
  };

  const statusColor = getStatusColor();
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: statusColor + "20",
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? 2 : Spacing.xs,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: statusColor,
            width: isSmall ? 6 : 8,
            height: isSmall ? 6 : 8,
          },
        ]}
      />
      <ThemedText
        type={isSmall ? "caption" : "small"}
        style={[styles.text, { color: statusColor }]}
      >
        {STATUS_LABELS[status]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  dot: {
    borderRadius: BorderRadius.full,
  },
  text: {
    fontWeight: "500",
  },
});
