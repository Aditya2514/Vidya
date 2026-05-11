import React, { useEffect } from 'react';
import { Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import BootSplash from 'react-native-bootsplash';

import { RootState } from '../store';
import { setUser } from '../store/slices/authSlice';
import WelcomeScreen from '../screens/WelcomeScreen';
import BooksSearchScreen from '../screens/BooksSearchScreen';
import SavedBooksScreen from '../screens/SavedBooksScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { Book } from '../types/book';
import { useThemeColors } from '../styles/theme';

export type RootStackParamList = {
  Login: undefined;
  Welcome: undefined;
  MainTabs: undefined;
  BookDetail: {
    book: Book;
  };
};

export type MainTabParamList = {
  Discover: undefined;
  Saved: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const colors = useThemeColors();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.accent,
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#E5E7EB',
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Discover" 
        component={BooksSearchScreen} 
        /* eslint-disable-next-line react/no-unstable-nested-components */
        options={{ tabBarIcon: () => <Text style={styles.iconText}>🔍</Text> }} 
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedBooksScreen} 
        /* eslint-disable-next-line react/no-unstable-nested-components */
        options={{ tabBarIcon: () => <Text style={styles.iconText}>🔖</Text> }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        /* eslint-disable-next-line react/no-unstable-nested-components */
        options={{ tabBarIcon: () => <Text style={styles.iconText}>⚙️</Text> }} 
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const hasSeenWelcome = useSelector((state: RootState) => state.savedBooks.hasSeenWelcome);
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const authInstance = getAuth();
    const subscriber = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({ 
          uid: firebaseUser.uid, 
          email: firebaseUser.email,
          name: firebaseUser.displayName 
        }));
      } else {
        dispatch(setUser(null));
      }
    });
    return subscriber; 
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {!hasSeenWelcome && (
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
            )}
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconText: {
    fontSize: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
