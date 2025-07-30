import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Импорты экранов
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import NewsScreen from './src/screens/NewsScreen';
import NewsDetailScreen from './src/screens/NewsDetailScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import JobsScreen from './src/screens/JobsScreen';
import EducationScreen from './src/screens/EducationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminPanelScreen from './src/screens/AdminPanelScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#10182A',
            },
            headerTintColor: '#FFD700',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Регистрация' }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'SilkGate' }}
          />
          <Stack.Screen 
            name="News" 
            component={NewsScreen} 
            options={{ title: 'Новости' }}
          />
          <Stack.Screen 
            name="NewsDetail" 
            component={NewsDetailScreen} 
            options={{ title: 'Новость' }}
          />
          <Stack.Screen 
            name="Projects" 
            component={ProjectsScreen} 
            options={{ title: 'Проекты' }}
          />
          <Stack.Screen 
            name="Jobs" 
            component={JobsScreen} 
            options={{ title: 'Вакансии' }}
          />
          <Stack.Screen 
            name="Education" 
            component={EducationScreen} 
            options={{ title: 'Образование' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ title: 'Профиль' }}
          />
          <Stack.Screen 
            name="AdminPanel" 
            component={AdminPanelScreen} 
            options={{ title: 'Админ-панель' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 