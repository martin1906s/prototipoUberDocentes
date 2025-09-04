import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import RoleSelectScreen from '../screens/Auth/RoleSelectScreen';
import UserSearchScreen from '../screens/User/UserSearchScreen';
import UserTeacherDetailScreen from '../screens/User/UserTeacherDetailScreen';
import UserRegisterScreen from '../screens/User/UserRegisterScreen';
import UserHistoryScreen from '../screens/User/UserHistoryScreen';
import UserProfileScreen from '../screens/User/UserProfileScreen';

import TeacherSetupScreen from '../screens/Teacher/TeacherSetupScreen';
import TeacherProposalsScreen from '../screens/Teacher/TeacherProposalsScreen';
import TeacherProfileScreen from '../screens/Teacher/TeacherProfileScreen';
import TeacherScheduleScreen from '../screens/Teacher/TeacherScheduleScreen';


import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';


import ReportsScreen from '../screens/Admin/ReportsScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="RoleSelect"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth / Role selection */}
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />

        {/* Usuario */}
        <Stack.Screen name="UserTabs" component={UserTabs} />
        <Stack.Screen name="UserTeacherDetail" component={UserTeacherDetailScreen} />
        <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
        <Stack.Screen name="UserHistory" component={UserHistoryScreen} />

        {/* Docente */}
        <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
        <Stack.Screen name="TeacherSetup" component={TeacherSetupScreen} />

        {/* Admin */}
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          position: 'absolute', 
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'UserSearch': iconName = 'search'; break;
            case 'UserProfile': iconName = 'person'; break;
            case 'UserHistory': iconName = 'history'; break;
            default: iconName = 'help';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="UserSearch" component={UserSearchScreen} options={{ title: 'Buscar' }} />
      <Tab.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="UserHistory" component={UserHistoryScreen} options={{ title: 'Historial' }} />
    </Tab.Navigator>
  );
}

function TeacherTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          position: 'absolute', 
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'TeacherProposals': iconName = 'mail'; break;
            case 'TeacherProfile': iconName = 'person'; break;
            case 'TeacherSchedule': iconName = 'schedule'; break;

            default: iconName = 'help';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="TeacherProposals" component={TeacherProposalsScreen} options={{ title: 'Propuestas' }} />
      <Tab.Screen name="TeacherProfile" component={TeacherProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="TeacherSchedule" component={TeacherScheduleScreen} options={{ title: 'Horario' }} />

    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#EF4444',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          position: 'absolute', 
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'AdminDashboard': iconName = 'dashboard'; break;


            case 'Reports': iconName = 'bar-chart'; break;

            default: iconName = 'help';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />


      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reportes' }} />

    </Tab.Navigator>
  );
}


