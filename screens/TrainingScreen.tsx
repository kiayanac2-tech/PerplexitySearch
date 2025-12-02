import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { TrainingCard } from "@/components/TrainingCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, TrainingModule } from "@/lib/storage";
import { TrainingStackParamList } from "@/navigation/TrainingStackNavigator";

type TrainingScreenProps = {
  navigation: NativeStackNavigationProp<TrainingStackParamList, "Training">;
};

type CategoryFilter = TrainingModule["category"] | "all";

const CATEGORY_FILTERS: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Onboarding", value: "onboarding" },
  { label: "Product", value: "product" },
  { label: "Communication", value: "communication" },
  { label: "Compliance", value: "compliance" },
  { label: "Advanced", value: "advanced" },
];

export default function TrainingScreen({ navigation }: TrainingScreenProps) {
  const { theme } = useTheme();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadModules = useCallback(async () => {
    try {
      const data = await storage.getTrainingModules();
      setModules(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Error loading training modules:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadModules();
    }, [loadModules])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadModules();
  }, [loadModules]);

  const filteredModules = modules.filter((module) =>
    categoryFilter === "all" ? true : module.category === categoryFilter
  );

  const requiredModules = modules.filter((m) => m.isRequired);
  const completedRequired = requiredModules.filter(
    (m) => m.completionRate === 100
  ).length;
  const overallProgress =
    requiredModules.length > 0
      ? Math.round(
          requiredModules.reduce((sum, m) => sum + m.completionRate, 0) /
            requiredModules.length
        )
      : 0;

  const renderHeader = () => (
    <View style={styles.header}>
      <View
        style={[styles.progressCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <View style={styles.progressHeader}>
          <View
            style={[styles.progressIcon, { backgroundColor: theme.primary + "20" }]}
          >
            <Feather name="award" size={24} color={theme.primary} />
          </View>
          <View style={styles.progressInfo}>
            <ThemedText type="h3">{overallProgress}%</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Overall Progress
            </ThemedText>
          </View>
        </View>
        <View style={styles.progressDetails}>
          <View style={styles.progressStat}>
            <ThemedText type="h4" style={{ color: theme.statusAvailable }}>
              {completedRequired}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Completed
            </ThemedText>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.border }]}
          />
          <View style={styles.progressStat}>
            <ThemedText type="h4" style={{ color: theme.primary }}>
              {requiredModules.length}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Required
            </ThemedText>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.border }]}
          />
          <View style={styles.progressStat}>
            <ThemedText type="h4">{modules.length}</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Total
            </ThemedText>
          </View>
        </View>
        <View
          style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}
        >
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.primary, width: `${overallProgress}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        {CATEGORY_FILTERS.map((filter) => (
          <Pressable
            key={filter.value}
            onPress={() => setCategoryFilter(filter.value)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  categoryFilter === filter.value
                    ? theme.primary
                    : theme.backgroundDefault,
              },
            ]}
          >
            <ThemedText
              type="caption"
              style={{
                color: categoryFilter === filter.value ? "#FFFFFF" : theme.text,
                fontWeight: categoryFilter === filter.value ? "600" : "400",
              }}
            >
              {filter.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {filteredModules.length} module{filteredModules.length !== 1 ? "s" : ""}
      </ThemedText>
    </View>
  );

  const renderItem = ({ item }: { item: TrainingModule }) => (
    <View style={styles.moduleItem}>
      <TrainingCard
        module={item}
        onPress={() => navigation.navigate("ModuleDetail", { moduleId: item.id })}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name="book-open" size={48} color={theme.textSecondary} />
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, marginTop: Spacing.md }}
      >
        No modules found
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
      >
        Try adjusting your filter
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
      data={filteredModules}
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
  progressCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  progressInfo: {
    gap: 2,
  },
  progressDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  progressStat: {
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 30,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
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
  moduleItem: {
    marginBottom: Spacing.md,
  },
  emptyState: {
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
});
