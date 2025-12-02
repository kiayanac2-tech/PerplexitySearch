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
import { storage, TrainingModule } from "@/lib/storage";
import { TrainingStackParamList } from "@/navigation/TrainingStackNavigator";

type ModuleDetailScreenProps = {
  navigation: NativeStackNavigationProp<TrainingStackParamList, "ModuleDetail">;
  route: RouteProp<TrainingStackParamList, "ModuleDetail">;
};

const CATEGORY_CONFIG: Record<
  TrainingModule["category"],
  { icon: keyof typeof Feather.glyphMap; color: string; label: string }
> = {
  onboarding: { icon: "user-plus", color: "#2563EB", label: "Onboarding" },
  product: { icon: "box", color: "#7C3AED", label: "Product Knowledge" },
  communication: { icon: "message-circle", color: "#0891B2", label: "Communication" },
  compliance: { icon: "shield", color: "#DC2626", label: "Compliance" },
  advanced: { icon: "award", color: "#CA8A04", label: "Advanced" },
};

export default function ModuleDetailScreen({
  navigation,
  route,
}: ModuleDetailScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { moduleId } = route.params;
  const [module, setModule] = useState<TrainingModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModule();
  }, [moduleId]);

  const loadModule = async () => {
    try {
      const modules = await storage.getTrainingModules();
      const found = modules.find((m) => m.id === moduleId);
      setModule(found || null);
    } catch (error) {
      console.error("Error loading module:", error);
    } finally {
      setIsLoading(false);
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

  if (!module) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Feather name="alert-circle" size={48} color={theme.textSecondary} />
        <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
          Module not found
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

  const config = CATEGORY_CONFIG[module.category];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: config.color + "20" }]}>
            <Feather name={config.icon} size={32} color={config.color} />
          </View>

          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: config.color + "20" }]}>
              <ThemedText type="small" style={{ color: config.color, fontWeight: "600" }}>
                {config.label}
              </ThemedText>
            </View>
            {module.isRequired ? (
              <View style={[styles.badge, { backgroundColor: theme.error + "20" }]}>
                <ThemedText type="small" style={{ color: theme.error, fontWeight: "600" }}>
                  Required
                </ThemedText>
              </View>
            ) : null}
          </View>

          <ThemedText type="h2" style={styles.title}>
            {module.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={16} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {module.duration}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.progressSection, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.progressHeader}>
            <ThemedText type="h4">Completion Progress</ThemedText>
            <ThemedText type="h3" style={{ color: config.color }}>
              {module.completionRate}%
            </ThemedText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: config.color, width: `${module.completionRate}%` },
              ]}
            />
          </View>
          {module.completionRate === 100 ? (
            <View style={styles.completedBadge}>
              <Feather name="check-circle" size={16} color={theme.statusAvailable} />
              <ThemedText type="small" style={{ color: theme.statusAvailable }}>
                Completed
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            About This Module
          </ThemedText>
          <ThemedText type="body" style={{ lineHeight: 24 }}>
            {module.description}
          </ThemedText>
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            What You Will Learn
          </ThemedText>
          <View style={styles.learningPoints}>
            <View style={styles.learningPoint}>
              <View style={[styles.pointIcon, { backgroundColor: config.color + "20" }]}>
                <Feather name="check" size={14} color={config.color} />
              </View>
              <ThemedText type="body">
                Core concepts and best practices
              </ThemedText>
            </View>
            <View style={styles.learningPoint}>
              <View style={[styles.pointIcon, { backgroundColor: config.color + "20" }]}>
                <Feather name="check" size={14} color={config.color} />
              </View>
              <ThemedText type="body">
                Practical skills and techniques
              </ThemedText>
            </View>
            <View style={styles.learningPoint}>
              <View style={[styles.pointIcon, { backgroundColor: config.color + "20" }]}>
                <Feather name="check" size={14} color={config.color} />
              </View>
              <ThemedText type="body">
                Real-world application scenarios
              </ThemedText>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: theme.accent + "15",
              borderColor: theme.accent + "30",
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.tipHeader}>
            <Feather name="info" size={18} color={theme.accent} />
            <ThemedText type="body" style={{ color: theme.accent, fontWeight: "600" }}>
              Pro Tip
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ marginTop: Spacing.sm }}>
            Take notes while going through the module. Active learning helps retain information better.
          </ThemedText>
        </View>
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
        <Button onPress={() => navigation.goBack()}>
          {module.completionRate === 100 ? "Review Module" : "Start Module"}
        </Button>
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
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  badges: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  progressSection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    justifyContent: "center",
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  learningPoints: {
    gap: Spacing.md,
  },
  learningPoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  pointIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tipCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  tipHeader: {
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
