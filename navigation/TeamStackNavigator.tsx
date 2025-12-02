import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeamScreen from "@/screens/TeamScreen";
import AgentDetailScreen from "@/screens/AgentDetailScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type TeamStackParamList = {
  Team: undefined;
  AgentDetail: { agentId: string };
};

const Stack = createNativeStackNavigator<TeamStackParamList>();

export default function TeamStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Team"
        component={TeamScreen}
        options={{
          headerTitle: "Team",
        }}
      />
      <Stack.Screen
        name="AgentDetail"
        component={AgentDetailScreen}
        options={{
          headerTitle: "Agent Details",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
