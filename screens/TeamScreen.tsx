import React, { useState, useCallback } from "react";
import { View, StyleSheet, TextInput, Pressable, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { AgentCard } from "@/components/AgentCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, Agent, AgentStatus } from "@/lib/storage";
import { TeamStackParamList } from "@/navigation/TeamStackNavigator";

type TeamScreenProps = {
  navigation: NativeStackNavigationProp<TeamStackParamList, "Team">;
};

const STATUS_FILTERS: { label: string; value: AgentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Busy", value: "busy" },
  { label: "Break", value: "break" },
  { label: "Offline", value: "offline" },
];

export default function TeamScreen({ navigation }: TeamScreenProps) {
  const { theme } = useTheme();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAgents = useCallback(async () => {
    try {
      const data = await storage.getAgents();
      setAgents(data);
    } catch (error) {
      console.error("Error loading agents:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAgents();
    }, [loadAgents])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAgents();
  }, [loadAgents]);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      searchQuery === "" ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <View
        style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault }]}
      >
        <Feather name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search agents..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 ? (
          <Pressable onPress={() => setSearchQuery("")}>
            <Feather name="x" size={18} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filtersRow}>
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
              type="small"
              style={{
                color:
                  statusFilter === filter.value ? "#FFFFFF" : theme.text,
                fontWeight: statusFilter === filter.value ? "600" : "400",
              }}
            >
              {filter.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.countRow}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {filteredAgents.length} agent{filteredAgents.length !== 1 ? "s" : ""}
        </ThemedText>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Agent }) => (
    <View style={styles.agentItem}>
      <AgentCard
        agent={item}
        onPress={() => navigation.navigate("AgentDetail", { agentId: item.id })}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name="users" size={48} color={theme.textSecondary} />
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, marginTop: Spacing.md }}
      >
        No agents found
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
      >
        Try adjusting your search or filters
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
      data={filteredAgents}
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
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filtersRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  countRow: {
    marginTop: Spacing.md,
  },
  agentItem: {
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
