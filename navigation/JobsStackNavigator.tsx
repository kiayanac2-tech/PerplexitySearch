import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JobsScreen from "@/screens/JobsScreen";
import JobDetailScreen from "@/screens/JobDetailScreen";
import ApplicationsScreen from "@/screens/ApplicationsScreen";
import ApplicationDetailScreen from "@/screens/ApplicationDetailScreen";
import CreateJobScreen from "@/screens/CreateJobScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type JobsStackParamList = {
  Jobs: undefined;
  JobDetail: { jobId: string };
  Applications: { jobId: string };
  ApplicationDetail: { applicationId: string };
  CreateJob: undefined;
};

const Stack = createNativeStackNavigator<JobsStackParamList>();

export default function JobsStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Jobs"
        component={JobsScreen}
        options={{
          headerTitle: "Jobs & Recruitment",
        }}
      />
      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
        options={{
          headerTitle: "Job Details",
        }}
      />
      <Stack.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          headerTitle: "Applications",
        }}
      />
      <Stack.Screen
        name="ApplicationDetail"
        component={ApplicationDetailScreen}
        options={{
          headerTitle: "Application",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="CreateJob"
        component={CreateJobScreen}
        options={{
          headerTitle: "Create Job Posting",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
