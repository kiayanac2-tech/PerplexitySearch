import React, { useState } from "react";
import { View, StyleSheet, Switch, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage } from "@/lib/storage";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "Settings">;
};

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will reset the app to its initial state. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await storage.clearAll();
            await storage.initializeData();
            Alert.alert("Success", "All data has been reset.");
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: keyof typeof Feather.glyphMap,
    iconColor: string,
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View
      style={[styles.settingItem, { backgroundColor: theme.backgroundDefault }]}
    >
      <View style={styles.settingContent}>
        <View style={[styles.settingIcon, { backgroundColor: iconColor + "20" }]}>
          <Feather name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.settingText}>
          <ThemedText type="body">{title}</ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {subtitle}
          </ThemedText>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.backgroundSecondary, true: theme.primary + "60" }}
        thumbColor={value ? theme.primary : theme.backgroundTertiary}
      />
    </View>
  );

  return (
    <ScreenScrollView>
      <ThemedText type="h4" style={styles.sectionTitle}>
        Notifications
      </ThemedText>
      {renderSettingItem(
        "bell",
        theme.primary,
        "Push Notifications",
        "Receive alerts for new applications and updates",
        notifications,
        setNotifications
      )}

      <ThemedText type="h4" style={styles.sectionTitle}>
        Preferences
      </ThemedText>
      {renderSettingItem(
        "volume-2",
        theme.accent,
        "Sound Effects",
        "Play sounds for actions and notifications",
        soundEffects,
        setSoundEffects
      )}
      {renderSettingItem(
        "refresh-cw",
        theme.secondary,
        "Auto Refresh",
        "Automatically refresh data in the background",
        autoRefresh,
        setAutoRefresh
      )}

      <ThemedText type="h4" style={styles.sectionTitle}>
        Data Management
      </ThemedText>
      <Pressable
        onPress={handleClearData}
        style={({ pressed }) => [
          styles.settingItem,
          { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <View style={styles.settingContent}>
          <View style={[styles.settingIcon, { backgroundColor: theme.error + "20" }]}>
            <Feather name="trash-2" size={20} color={theme.error} />
          </View>
          <View style={styles.settingText}>
            <ThemedText type="body" style={{ color: theme.error }}>
              Clear All Data
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Reset the app to its initial state
            </ThemedText>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={theme.error} />
      </Pressable>

      <ThemedText type="h4" style={styles.sectionTitle}>
        About
      </ThemedText>
      <View
        style={[styles.aboutSection, { backgroundColor: theme.backgroundDefault }]}
      >
        <View style={styles.aboutItem}>
          <ThemedText type="body">Version</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            1.0.0
          </ThemedText>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.aboutItem}>
          <ThemedText type="body">Build</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            2024.12.02
          </ThemedText>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.aboutItem}>
          <ThemedText type="body">Platform</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            React Native / Expo
          </ThemedText>
        </View>
      </View>

      <View style={styles.footerSection}>
        <ThemedText
          type="caption"
          style={{ color: theme.textSecondary, textAlign: "center" }}
        >
          VCenter - Virtual Call Center Management
        </ThemedText>
        <ThemedText
          type="caption"
          style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.xs }}
        >
          Built for your virtual business success
        </ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    flex: 1,
    gap: 2,
  },
  aboutSection: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  aboutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.lg,
  },
  footerSection: {
    marginTop: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
});
