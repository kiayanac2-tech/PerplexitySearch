import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { JobCard } from "@/components/JobCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { storage, JobPosting, Application } from "@/lib/storage";
import { JobsStackParamList } from "@/navigation/JobsStackNavigator";

type JobsScreenProps = {
  navigation: NativeStackNavigationProp<JobsStackParamList, "Jobs">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function JobsScreen({ navigation }: JobsScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<"postings" | "applications">("postings");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fabScale = useSharedValue(1);
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const loadData = useCallback(async () => {
    try {
      const [jobsData, appsData] = await Promise.all([
        storage.getJobPostings(),
        storage.getApplications(),
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (error) {
      console.error("Error loading jobs data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const pendingApps = applications.filter((a) => a.status === "pending").length;

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.statsRow}>
        <View
          style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
        >
          <Feather name="briefcase" size={24} color={theme.primary} />
          <View>
            <ThemedText type="h3">{jobs.filter((j) => j.isActive).length}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Active Jobs
            </ThemedText>
          </View>
        </View>
        <View
          style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
        >
          <Feather name="inbox" size={24} color={theme.secondary} />
          <View>
            <ThemedText type="h3">{applications.length}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Applications
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <Pressable
          onPress={() => setActiveTab("postings")}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "postings" ? theme.primary : "transparent",
            },
          ]}
        >
          <ThemedText
            type="body"
            style={{
              color: activeTab === "postings" ? "#FFFFFF" : theme.text,
              fontWeight: activeTab === "postings" ? "600" : "400",
            }}
          >
            Job Postings
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("applications")}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "applications" ? theme.primary : "transparent",
            },
          ]}
        >
          <View style={styles.tabContent}>
            <ThemedText
              type="body"
              style={{
                color: activeTab === "applications" ? "#FFFFFF" : theme.text,
                fontWeight: activeTab === "applications" ? "600" : "400",
              }}
            >
              Applications
            </ThemedText>
            {pendingApps > 0 ? (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      activeTab === "applications" ? "#FFFFFF" : theme.error,
                  },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{
                    color:
                      activeTab === "applications" ? theme.primary : "#FFFFFF",
                    fontWeight: "600",
                  }}
                >
                  {pendingApps}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </Pressable>
      </View>
    </View>
  );

  const renderJobItem = ({ item }: { item: JobPosting }) => (
    <View style={styles.jobItem}>
      <JobCard
        job={item}
        onPress={() => navigation.navigate("JobDetail", { jobId: item.id })}
      />
    </View>
  );

  const renderApplicationItem = ({ item }: { item: Application }) => {
    const job = jobs.find((j) => j.id === item.jobId);

    const getStatusColor = () => {
      switch (item.status) {
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
        <View style={styles.applicationHeader}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {item.name}
          </ThemedText>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() + "20" },
            ]}
          >
            <ThemedText
              type="caption"
              style={{ color: getStatusColor(), fontWeight: "600" }}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </ThemedText>
          </View>
        </View>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary }}
          numberOfLines={1}
        >
          Applied for: {job?.title || "Unknown Position"}
        </ThemedText>
        <View style={styles.applicationMeta}>
          <View style={styles.metaItem}>
            <Feather name="mail" size={12} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {item.email}
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
      <Feather
        name={activeTab === "postings" ? "briefcase" : "inbox"}
        size={48}
        color={theme.textSecondary}
      />
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, marginTop: Spacing.md }}
      >
        {activeTab === "postings" ? "No job postings yet" : "No applications yet"}
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
      >
        {activeTab === "postings"
          ? "Create your first job posting to start recruiting"
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
    <View style={{ flex: 1 }}>
      <ScreenFlatList
        data={activeTab === "postings" ? jobs : applications}
        renderItem={activeTab === "postings" ? renderJobItem : renderApplicationItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <AnimatedPressable
        onPress={() => navigation.navigate("CreateJob")}
        onPressIn={() => {
          fabScale.value = withSpring(0.9, { damping: 15, stiffness: 150 });
        }}
        onPressOut={() => {
          fabScale.value = withSpring(1, { damping: 15, stiffness: 150 });
        }}
        style={[
          styles.fab,
          {
            backgroundColor: theme.primary,
            bottom: 80 + insets.bottom,
            ...Shadows.fab,
          },
          fabAnimatedStyle,
        ]}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </AnimatedPressable>
    </View>
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
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xs,
  },
  jobItem: {
    marginBottom: Spacing.md,
  },
  applicationCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  applicationMeta: {
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
  fab: {
    position: "absolute",
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
});
