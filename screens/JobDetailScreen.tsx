import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, JobPosting } from "@/lib/storage";
import { JobsStackParamList } from "@/navigation/JobsStackNavigator";

type JobDetailScreenProps = {
  navigation: NativeStackNavigationProp<JobsStackParamList, "JobDetail">;
  route: RouteProp<JobsStackParamList, "JobDetail">;
};

export default function JobDetailScreen({
  navigation,
  route,
}: JobDetailScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { jobId } = route.params;
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const jobs = await storage.getJobPostings();
      const found = jobs.find((j) => j.id === jobId);
      setJob(found || null);
    } catch (error) {
      console.error("Error loading job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJobStatus = async () => {
    if (!job) return;
    try {
      await storage.updateJobPosting(jobId, { isActive: !job.isActive });
      setJob({ ...job, isActive: !job.isActive });
    } catch (error) {
      console.error("Error updating job status:", error);
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

  if (!job) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Feather name="alert-circle" size={48} color={theme.textSecondary} />
        <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
          Job posting not found
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
          { paddingBottom: insets.bottom + Spacing.xl + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.badges}>
            <View
              style={[styles.badge, { backgroundColor: getTypeColor() + "20" }]}
            >
              <ThemedText
                type="small"
                style={{ color: getTypeColor(), fontWeight: "600" }}
              >
                {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
              </ThemedText>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: job.isActive
                    ? theme.statusAvailable + "20"
                    : theme.statusOffline + "20",
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: job.isActive
                      ? theme.statusAvailable
                      : theme.statusOffline,
                  },
                ]}
              />
              <ThemedText
                type="small"
                style={{
                  color: job.isActive
                    ? theme.statusAvailable
                    : theme.statusOffline,
                  fontWeight: "600",
                }}
              >
                {job.isActive ? "Active" : "Closed"}
              </ThemedText>
            </View>
          </View>

          <ThemedText type="h2" style={styles.title}>
            {job.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={16} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {job.location}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Feather name="briefcase" size={16} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {job.department}
              </ThemedText>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="dollar-sign" size={16} color={theme.primary} />
              <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>
                {job.salary}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={16} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                Posted {formatDate(job.createdAt)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Description
          </ThemedText>
          <ThemedText type="body" style={{ lineHeight: 24 }}>
            {job.description}
          </ThemedText>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Requirements
          </ThemedText>
          {job.requirements.map((req, index) => (
            <View key={index} style={styles.listItem}>
              <Feather name="check-circle" size={16} color={theme.statusAvailable} />
              <ThemedText type="body" style={styles.listText}>
                {req}
              </ThemedText>
            </View>
          ))}
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Benefits
          </ThemedText>
          {job.benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <Feather name="star" size={16} color={theme.accent} />
              <ThemedText type="body" style={styles.listText}>
                {benefit}
              </ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => navigation.navigate("Applications", { jobId: job.id })}
          style={({ pressed }) => [
            styles.applicantsCard,
            { backgroundColor: theme.primary + "10", opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={styles.applicantsContent}>
            <View
              style={[styles.applicantsIcon, { backgroundColor: theme.primary + "20" }]}
            >
              <Feather name="users" size={24} color={theme.primary} />
            </View>
            <View>
              <ThemedText type="h3" style={{ color: theme.primary }}>
                {job.applicationsCount}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Applications received
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={24} color={theme.primary} />
        </Pressable>
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
        <Pressable
          onPress={toggleJobStatus}
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: job.isActive
                ? theme.error + "15"
                : theme.statusAvailable + "15",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <ThemedText
            type="body"
            style={{
              color: job.isActive ? theme.error : theme.statusAvailable,
              fontWeight: "600",
            }}
          >
            {job.isActive ? "Close Job" : "Reopen Job"}
          </ThemedText>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => navigation.navigate("Applications", { jobId: job.id })}
          >
            View Applications
          </Button>
        </View>
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
  header: {
    marginBottom: Spacing.xl,
  },
  badges: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.xl,
    marginTop: Spacing.sm,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  listText: {
    flex: 1,
  },
  applicantsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  applicantsContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  applicantsIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  secondaryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
});
