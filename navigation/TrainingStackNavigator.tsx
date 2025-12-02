import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrainingScreen from "@/screens/TrainingScreen";
import ModuleDetailScreen from "@/screens/ModuleDetailScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type TrainingStackParamList = {
  Training: undefined;
  ModuleDetail: { moduleId: string };
};

const Stack = createNativeStackNavigator<TrainingStackParamList>();

export default function TrainingStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Training"
        component={TrainingScreen}
        options={{
          headerTitle: "Training Center",
        }}
      />
      <Stack.Screen
        name="ModuleDetail"
        component={ModuleDetailScreen}
        options={{
          headerTitle: "Module Details",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
