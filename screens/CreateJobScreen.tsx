import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, JobPosting } from "@/lib/storage";
import { JobsStackParamList } from "@/navigation/JobsStackNavigator";

type CreateJobScreenProps = {
  navigation: NativeStackNavigationProp<JobsStackParamList, "CreateJob">;
};

const JOB_TYPES: JobPosting["type"][] = ["full-time", "part-time", "contract"];
const DEPARTMENTS = ["Customer Support", "Sales", "Technical Support", "Operations"];

export default function CreateJobScreen({ navigation }: CreateJobScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<JobPosting["type"]>("full-time");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [location, setLocation] = useState("Remote - USA");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a job title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a job description");
      return;
    }
    if (!salary.trim()) {
      Alert.alert("Error", "Please enter salary information");
      return;
    }

    setIsSubmitting(true);
    try {
      await storage.createJobPosting({
        title: title.trim(),
        description: description.trim(),
        type,
        department,
        location: location.trim() || "Remote",
        salary: salary.trim(),
        requirements: requirements
          .split("\n")
          .filter((r) => r.trim())
          .map((r) => r.trim()),
        benefits: benefits
          .split("\n")
          .filter((b) => b.trim())
          .map((b) => b.trim()),
        isActive: true,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error creating job:", error);
      Alert.alert("Error", "Failed to create job posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (t: JobPosting["type"]) => {
    switch (t) {
      case "full-time":
        return "Full-time";
      case "part-time":
        return "Part-time";
      case "contract":
        return "Contract";
      default:
        return t;
    }
  };

  return (
    <ScreenKeyboardAwareScrollView
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <ThemedText type="small" style={styles.label}>
            Job Title *
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundDefault,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="e.g., Remote Customer Service Representative"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="small" style={styles.label}>
            Job Type
          </ThemedText>
          <View style={styles.typeButtons}>
            {JOB_TYPES.map((t) => (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor:
                      type === t ? theme.primary : theme.backgroundDefault,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: type === t ? "#FFFFFF" : theme.text,
                    fontWeight: type === t ? "600" : "400",
                  }}
                >
                  {getTypeLabel(t)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <ThemedText type="small" style={styles.label}>
            Department
          </ThemedText>
          <View style={styles.typeButtons}>
            {DEPARTMENTS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDepartment(d)}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor:
                      department === d ? theme.primary : theme.backgroundDefault,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: department === d ? "#FFFFFF" : theme.text,
                    fontWeight: department === d ? "600" : "400",
                  }}
                >
                  {d}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <ThemedText type="small" style={styles.label}>
              Location
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.backgroundDefault,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Remote - USA"
              placeholderTextColor={theme.textSecondary}
              value={location}
              onChangeText={setLocation}
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <ThemedText type="small" style={styles.label}>
              Salary *
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.backgroundDefault,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="$15-$20/hour"
              placeholderTextColor={theme.textSecondary}
              value={salary}
              onChangeText={setSalary}
            />
          </View>
        </View>

        <View style={styles.field}>
          <ThemedText type="small" style={styles.label}>
            Description *
          </ThemedText>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.backgroundDefault,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <ThemedText type="small" style={styles.label}>
              Requirements
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              One per line
            </ThemedText>
          </View>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.backgroundDefault,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="High school diploma&#10;Excellent communication skills&#10;Reliable internet connection"
            placeholderTextColor={theme.textSecondary}
            value={requirements}
            onChangeText={setRequirements}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <ThemedText type="small" style={styles.label}>
              Benefits
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              One per line
            </ThemedText>
          </View>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.backgroundDefault,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Work from home&#10;Flexible scheduling&#10;Paid training"
            placeholderTextColor={theme.textSecondary}
            value={benefits}
            onChangeText={setBenefits}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Button onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Job Posting"}
        </Button>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.lg,
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontWeight: "600",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
  },
  typeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  typeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
});
