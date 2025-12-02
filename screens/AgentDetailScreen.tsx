import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, Agent, AgentStatus } from "@/lib/storage";
import { TeamStackParamList } from "@/navigation/TeamStackNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AgentDetailScreenProps = {
  navigation: NativeStackNavigationProp<TeamStackParamList, "AgentDetail">;
  route: RouteProp<TeamStackParamList, "AgentDetail">;
};

const AVATAR_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#EA580C",
  "#16A34A",
  "#0891B2",
];

export default function AgentDetailScreen({
  navigation,
  route,
}: AgentDetailScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { agentId } = route.params;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgent();
  }, [agentId]);

  const loadAgent = async () => {
    try {
      const data = await storage.getAgent(agentId);
      setAgent(data);
    } catch (error) {
      console.error("Error loading agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: AgentStatus) => {
    if (!agent) return;
    try {
      await storage.updateAgent(agentId, { status: newStatus });
      setAgent({ ...agent, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          Loading...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!agent) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Feather name="alert-circle" size={48} color={theme.textSecondary} />
        <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
          Agent not found
        </ThemedText>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.primary }]}
        >
          <ThemedText type="body" style={{ color: "#FFFFFF" }}>Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const avatarColor = AVATAR_COLORS[agent.avatarIndex % AVATAR_COLORS.length];
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <ThemedText style={styles.avatarText}>{initials}</ThemedText>
          </View>
          <ThemedText type="h2" style={styles.name}>
            {agent.name}
          </ThemedText>
          <StatusBadge status={agent.status} />
          <ThemedText
            type="small"
            style={[styles.employeeId, { color: theme.textSecondary }]}
          >
            {agent.employeeId} - {agent.role.charAt(0).toUpperCase() + agent.role.slice(1)}
          </ThemedText>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Contact Information
          </ThemedText>
          <View style={styles.infoRow}>
            <Feather name="mail" size={18} color={theme.textSecondary} />
            <ThemedText type="body">{agent.email}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Feather name="phone" size={18} color={theme.textSecondary} />
            <ThemedText type="body">{agent.phone}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Feather name="briefcase" size={18} color={theme.textSecondary} />
            <ThemedText type="body">{agent.department}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={18} color={theme.textSecondary} />
            <ThemedText type="body">Hired {formatDate(agent.hireDate)}</ThemedText>
          </View>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Performance Metrics
          </ThemedText>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <ThemedText type="h2" style={{ color: theme.primary }}>
                {agent.callsHandled}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Calls Handled
              </ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText type="h2" style={{ color: theme.accent }}>
                {agent.avgResponseTime}m
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Avg Response
              </ThemedText>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.ratingRow}>
                <ThemedText type="h2" style={{ color: theme.statusAvailable }}>
                  {agent.rating}
                </ThemedText>
                <Feather name="star" size={20} color={theme.statusAvailable} />
              </View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Rating
              </ThemedText>
            </View>
          </View>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Update Status
          </ThemedText>
          <View style={styles.statusButtons}>
            {(["available", "busy", "break", "offline"] as AgentStatus[]).map(
              (status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  style={({ pressed }) => [
                    styles.statusButton,
                    {
                      backgroundColor:
                        agent.status === status
                          ? theme.primary
                          : theme.backgroundSecondary,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{
                      color: agent.status === status ? "#FFFFFF" : theme.text,
                      fontWeight: agent.status === status ? "600" : "400",
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </ThemedText>
                </Pressable>
              )
            )}
          </View>
        </View>

        {agent.currentTask ? (
          <View
            style={[
              styles.section,
              {
                backgroundColor: theme.statusBusy + "15",
                borderColor: theme.statusBusy + "30",
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.taskHeader}>
              <Feather name="phone-call" size={20} color={theme.statusBusy} />
              <ThemedText type="h4" style={{ color: theme.statusBusy }}>
                Current Task
              </ThemedText>
            </View>
            <ThemedText type="body" style={{ marginTop: Spacing.sm }}>
              {agent.currentTask}
            </ThemedText>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingBottom: insets.bottom + Spacing.lg,
          },
        ]}
      >
        <Button onPress={() => navigation.goBack()}>Close</Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.xl,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    marginBottom: Spacing.sm,
  },
  employeeId: {
    marginTop: Spacing.sm,
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  statusButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
});
