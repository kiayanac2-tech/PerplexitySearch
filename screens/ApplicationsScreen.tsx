import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, Application, JobPosting, ApplicationStatus } from "@/lib/storage";
import { JobsStackParamList } from "@/navigation/JobsStackNavigator";

type ApplicationsScreenProps = {
  navigation: NativeStackNavigationProp<JobsStackParamList, "Applications">;
  route: RouteProp<JobsStackParamList, "Applications">;
};

const STATUS_FILTERS: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Interview", value: "interview" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function ApplicationsScreen({
  navigation,
  route,
}: ApplicationsScreenProps) {
  const { theme } = useTheme();
  const { jobId } = route.params;
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<JobPosting | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [appsData, jobsData] = await Promise.all([
        storage.getApplicationsForJob(jobId),
        storage.getJobPostings(),
      ]);
      setApplications(appsData);
      setJob(jobsData.find((j) => j.id === jobId) || null);
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const filteredApplications = applications.filter((app) =>
    statusFilter === "all" ? true : app.status === statusFilter
  );

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

  const renderHeader = () => (
    <View style={styles.header}>
      {job ? (
        <View
          style={[styles.jobInfo, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Applications for
          </ThemedText>
          <ThemedText type="h4" numberOfLines={2}>
            {job.title}
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.filtersContainer}>
        {STATUS_FILTERS.map((filter) => (
          <Pressable
            key={filter.value}
            onPress={() => setStatusFilter(filter.value)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  statusFilter === filter.value
                    ? theme.primary
                    : theme.backgroundDefault,
              },
            ]}
          >
            <ThemedText
              type="caption"
              style={{
                color: statusFilter === filter.value ? "#FFFFFF" : theme.text,
                fontWeight: statusFilter === filter.value ? "600" : "400",
              }}
            >
              {filter.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {filteredApplications.length} application
        {filteredApplications.length !== 1 ? "s" : ""}
      </ThemedText>
    </View>
  );

  const renderItem = ({ item }: { item: Application }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ApplicationDetail", { applicationId: item.id })
        }
        style={({ pressed }) => [
          styles.applicationCard,
          { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.nameSection}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              {item.name}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {item.email}
            </ThemedText>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
          >
            <ThemedText
              type="caption"
              style={{ color: statusColor, fontWeight: "600" }}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </ThemedText>
          </View>
        </View>

        <ThemedText
          type="small"
          style={{ color: theme.textSecondary }}
          numberOfLines={2}
        >
          {item.experience}
        </ThemedText>

        <View style={styles.cardFooter}>
          <View style={styles.metaItem}>
            <Feather name="phone" size={12} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {item.phone}
            </ThemedText>
          </View>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name="inbox" size={48} color={theme.textSecondary} />
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, marginTop: Spacing.md }}
      >
        No applications found
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
      >
        {statusFilter !== "all"
          ? "Try adjusting your filter"
          : "Applications will appear here when candidates apply"}
      </ThemedText>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          Loading...
        </ThemedText>
      </View>
    );
  }

  return (
    <ScreenFlatList
      data={filteredApplications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  jobInfo: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  applicationCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameSection: {
    flex: 1,
    gap: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  emptyState: {
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
});
