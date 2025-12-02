import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, Application, ApplicationStatus } from "@/lib/storage";
import { JobsStackParamList } from "@/navigation/JobsStackNavigator";

type ApplicationDetailScreenProps = {
  navigation: NativeStackNavigationProp<JobsStackParamList, "ApplicationDetail">;
  route: RouteProp<JobsStackParamList, "ApplicationDetail">;
};

const STATUS_OPTIONS: { status: ApplicationStatus; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { status: "pending", label: "Pending", icon: "clock" },
  { status: "reviewing", label: "Reviewing", icon: "eye" },
  { status: "interview", label: "Interview", icon: "video" },
  { status: "approved", label: "Approved", icon: "check-circle" },
  { status: "rejected", label: "Rejected", icon: "x-circle" },
];

export default function ApplicationDetailScreen({
  navigation,
  route,
}: ApplicationDetailScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { applicationId } = route.params;
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      const apps = await storage.getApplications();
      const found = apps.find((a) => a.id === applicationId);
      setApplication(found || null);
    } catch (error) {
      console.error("Error loading application:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: ApplicationStatus) => {
    if (!application) return;
    try {
      await storage.updateApplication(applicationId, { status: newStatus });
      setApplication({ ...application, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return theme.accent;
      case "reviewing":
        return theme.primary;
      case "interview":
        return theme.secondary;
      case "approved":
        return theme.statusAvailable;
      case "rejected":
        return theme.error;
      default:
        return theme.textSecondary;
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

  if (!application) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Feather name="alert-circle" size={48} color={theme.textSecondary} />
        <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
          Application not found
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

  const statusColor = getStatusColor(application.status);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
          >
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <ThemedText
              type="body"
              style={{ color: statusColor, fontWeight: "600" }}
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </ThemedText>
          </View>
          <ThemedText type="h2">{application.name}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Applied {new Date(application.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
            <ThemedText type="body">{application.email}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <Feather name="phone" size={18} color={theme.textSecondary} />
            <ThemedText type="body">{application.phone}</ThemedText>
          </View>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Experience
          </ThemedText>
          <ThemedText type="body" style={{ lineHeight: 24 }}>
            {application.experience}
          </ThemedText>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Cover Letter
          </ThemedText>
          <ThemedText type="body" style={{ lineHeight: 24 }}>
            {application.coverLetter}
          </ThemedText>
        </View>

        {application.notes ? (
          <View
            style={[
              styles.section,
              {
                backgroundColor: theme.accent + "15",
                borderColor: theme.accent + "30",
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.notesHeader}>
              <Feather name="file-text" size={18} color={theme.accent} />
              <ThemedText type="h4" style={{ color: theme.accent }}>
                Notes
              </ThemedText>
            </View>
            <ThemedText type="body" style={{ marginTop: Spacing.sm }}>
              {application.notes}
            </ThemedText>
          </View>
        ) : null}

        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Update Status
          </ThemedText>
          <View style={styles.statusGrid}>
            {STATUS_OPTIONS.map((option) => {
              const isActive = application.status === option.status;
              const color = getStatusColor(option.status);

              return (
                <Pressable
                  key={option.status}
                  onPress={() => updateStatus(option.status)}
                  style={({ pressed }) => [
                    styles.statusOption,
                    {
                      backgroundColor: isActive ? color + "20" : theme.backgroundSecondary,
                      borderColor: isActive ? color : "transparent",
                      borderWidth: 2,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Feather
                    name={option.icon}
                    size={20}
                    color={isActive ? color : theme.textSecondary}
                  />
                  <ThemedText
                    type="small"
                    style={{
                      color: isActive ? color : theme.text,
                      fontWeight: isActive ? "600" : "400",
                    }}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  backButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
});
