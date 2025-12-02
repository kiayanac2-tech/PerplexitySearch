import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { MetricCard } from "@/components/MetricCard";
import { AgentCard } from "@/components/AgentCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, BusinessMetrics, Agent, Campaign } from "@/lib/storage";

export default function DashboardScreen() {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      await storage.initializeData();
      const [metricsData, agentsData, campaignsData] = await Promise.all([
        storage.getMetrics(),
        storage.getAgents(),
        storage.getCampaigns(),
      ]);
      setMetrics(metricsData);
      setActiveAgents(
        agentsData.filter((a) => a.status === "available" || a.status === "busy")
      );
      setCampaigns(campaignsData.filter((c) => c.status === "active"));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

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
    <ScreenScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedText type="h3" style={styles.sectionTitle}>
        Overview
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.metricsContainer}
      >
        <MetricCard
          title="Active Agents"
          value={metrics?.activeAgents || 0}
          subtitle={`of ${metrics?.totalAgents || 0} total`}
          icon="users"
          iconColor={theme.statusAvailable}
          trend="up"
          trendValue="+2"
        />
        <MetricCard
          title="Total Calls"
          value={metrics?.totalCalls || 0}
          subtitle="this month"
          icon="phone"
          iconColor={theme.primary}
          trend="up"
          trendValue="+12%"
        />
        <MetricCard
          title="Avg Response"
          value={`${metrics?.avgResponseTime || 0}m`}
          subtitle="response time"
          icon="clock"
          iconColor={theme.accent}
          trend="down"
          trendValue="-8%"
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(metrics?.revenue || 0)}
          subtitle="this month"
          icon="dollar-sign"
          iconColor={theme.statusAvailable}
          trend="up"
          trendValue="+18%"
        />
      </ScrollView>

      <View style={styles.statsRow}>
        <View
          style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
        >
          <View
            style={[
              styles.statIcon,
              { backgroundColor: theme.secondary + "20" },
            ]}
          >
            <Feather name="inbox" size={20} color={theme.secondary} />
          </View>
          <View>
            <ThemedText type="h4">{metrics?.pendingApplications || 0}</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Pending Applications
            </ThemedText>
          </View>
        </View>
        <View
          style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
        >
          <View
            style={[styles.statIcon, { backgroundColor: theme.primary + "20" }]}
          >
            <Feather name="target" size={20} color={theme.primary} />
          </View>
          <View>
            <ThemedText type="h4">{metrics?.activeCampaigns || 0}</ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Active Campaigns
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="h3">Active Campaigns</ThemedText>
      </View>

      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <View
            key={campaign.id}
            style={[
              styles.campaignCard,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <View style={styles.campaignHeader}>
              <ThemedText type="body" style={{ fontWeight: "600" }}>
                {campaign.name}
              </ThemedText>
              <View
                style={[
                  styles.campaignBadge,
                  { backgroundColor: theme.statusAvailable + "20" },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{ color: theme.statusAvailable }}
                >
                  Active
                </ThemedText>
              </View>
            </View>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
            >
              {campaign.client}
            </ThemedText>
            <View style={styles.campaignStats}>
              <View style={styles.campaignStat}>
                <Feather name="users" size={14} color={theme.textSecondary} />
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {campaign.agentsAssigned} agents
                </ThemedText>
              </View>
              <View style={styles.campaignStat}>
                <Feather name="phone" size={14} color={theme.textSecondary} />
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {campaign.callsToday} calls today
                </ThemedText>
              </View>
              {campaign.conversionRate > 0 ? (
                <View style={styles.campaignStat}>
                  <Feather
                    name="trending-up"
                    size={14}
                    color={theme.statusAvailable}
                  />
                  <ThemedText
                    type="small"
                    style={{ color: theme.statusAvailable }}
                  >
                    {campaign.conversionRate}% conv
                  </ThemedText>
                </View>
              ) : null}
            </View>
          </View>
        ))
      ) : (
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="target" size={32} color={theme.textSecondary} />
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, marginTop: Spacing.sm }}
          >
            No active campaigns
          </ThemedText>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <ThemedText type="h3">Currently Active</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {activeAgents.length} agents
        </ThemedText>
      </View>

      {activeAgents.length > 0 ? (
        activeAgents.slice(0, 4).map((agent) => (
          <View key={agent.id} style={styles.agentItem}>
            <AgentCard agent={agent} onPress={() => {}} />
          </View>
        ))
      ) : (
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="users" size={32} color={theme.textSecondary} />
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, marginTop: Spacing.sm }}
          >
            No active agents right now
          </ThemedText>
        </View>
      )}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  metricsContainer: {
    gap: Spacing.md,
    paddingRight: Spacing.xl,
    marginLeft: -Spacing.xl,
    paddingLeft: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing["2xl"],
    marginBottom: Spacing.md,
  },
  campaignCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  campaignHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  campaignBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  campaignStats: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  campaignStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  agentItem: {
    marginBottom: Spacing.md,
  },
  emptyState: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
