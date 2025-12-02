import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, User, BusinessMetrics } from "@/lib/storage";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "Profile">;
};

const AVATAR_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#EA580C",
  "#16A34A",
  "#0891B2",
];

const DEMO_USER: User = {
  id: "admin1",
  name: "Alex Morgan",
  email: "alex.morgan@vcenter.com",
  role: "admin",
  avatarIndex: 0,
  employeeId: "ADM001",
  department: "Management",
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      await storage.initializeData();
      const auth = await storage.getAuth();
      if (auth.isAuthenticated && auth.user) {
        setUser(auth.user);
      } else {
        await storage.login(DEMO_USER);
        setUser(DEMO_USER);
      }
      const metricsData = await storage.getMetrics();
      setMetrics(metricsData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await storage.logout();
            setUser(null);
            await storage.login(DEMO_USER);
            setUser(DEMO_USER);
          },
        },
      ]
    );
  };

  if (isLoading || !user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          Loading...
        </ThemedText>
      </View>
    );
  }

  const avatarColor = AVATAR_COLORS[user.avatarIndex % AVATAR_COLORS.length];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case "admin":
        return theme.error;
      case "supervisor":
        return theme.primary;
      case "agent":
        return theme.secondary;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <ThemedText style={styles.avatarText}>{initials}</ThemedText>
        </View>
        <ThemedText type="h2" style={styles.name}>
          {user.name}
        </ThemedText>
        <View
          style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor() + "20" }]}
        >
          <ThemedText
            type="small"
            style={{ color: getRoleBadgeColor(), fontWeight: "600" }}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </ThemedText>
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {user.employeeId} - {user.department}
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
          <ThemedText type="body">{user.email}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Feather name="briefcase" size={18} color={theme.textSecondary} />
          <ThemedText type="body">{user.department}</ThemedText>
        </View>
      </View>

      {metrics ? (
        <View
          style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Business Overview
          </ThemedText>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <ThemedText type="h3" style={{ color: theme.primary }}>
                {metrics.totalAgents}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Total Agents
              </ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText type="h3" style={{ color: theme.secondary }}>
                {metrics.totalApplications}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Applications
              </ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText type="h3" style={{ color: theme.statusAvailable }}>
                {metrics.activeCampaigns}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Campaigns
              </ThemedText>
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.menuSection}>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={styles.menuItemContent}>
            <View style={[styles.menuIcon, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="settings" size={20} color={theme.primary} />
            </View>
            <ThemedText type="body">Settings</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={styles.menuItemContent}>
            <View style={[styles.menuIcon, { backgroundColor: theme.accent + "20" }]}>
              <Feather name="help-circle" size={20} color={theme.accent} />
            </View>
            <ThemedText type="body">Help & Support</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={styles.menuItemContent}>
            <View style={[styles.menuIcon, { backgroundColor: theme.secondary + "20" }]}>
              <Feather name="file-text" size={20} color={theme.secondary} />
            </View>
            <ThemedText type="body">Terms & Privacy</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.logoutSection}>
        <Button onPress={handleLogout} style={{ backgroundColor: theme.error }}>
          Logout
        </Button>
      </View>

      <View style={styles.versionSection}>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          VCenter v1.0.0
        </ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  roleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
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
  menuSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutSection: {
    marginBottom: Spacing.xl,
  },
  versionSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
});
