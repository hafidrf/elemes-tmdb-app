import React from 'react';
import { StyleSheet } from 'react-native';
import {
  DarkTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { findCategory } from '../../features/catalog/catalogConfig';
import { CategoryListScreen } from '../../features/catalog/screens/CategoryListScreen';
import { MoviesScreen } from '../../features/catalog/screens/MoviesScreen';
import { TvShowsScreen } from '../../features/catalog/screens/TvShowsScreen';
import { MovieDetailScreen } from '../../features/detail/screens/MovieDetailScreen';
import { PersonDetailScreen } from '../../features/detail/screens/PersonDetailScreen';
import { TvDetailScreen } from '../../features/detail/screens/TvDetailScreen';
import { PeopleScreen } from '../../features/people/screens/PeopleScreen';
import { SearchScreen } from '../../features/search/screens/SearchScreen';
import { WatchlistScreen } from '../../features/watchlist/screens/WatchlistScreen';
import { useWatchlistPersistence } from '../../features/watchlist/useWatchlistPersistence';
import { AppIcon, IconName } from '../../shared/components/AppIcon';
import { OfflineBanner } from '../../shared/components/OfflineBanner';
import { colors } from '../../shared/theme/colors';
import { RootStackParamList, RootTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    primary: colors.primary,
    border: colors.border,
    notification: colors.primary,
  },
};

const TAB_ICONS: Record<keyof RootTabParamList, IconName> = {
  MoviesTab: 'movie',
  TvTab: 'tv',
  PeopleTab: 'people',
  WatchlistTab: 'bookmark',
};

const TabsNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      // tabs render their own headline, so a navigator header would repeat it
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIcon: ({ focused }) => (
        <AppIcon
          name={TAB_ICONS[route.name]}
          size={19}
          style={focused ? styles.tabIconActive : styles.tabIconIdle}
        />
      ),
    })}>
    <Tab.Screen name="MoviesTab" component={MoviesScreen} options={{ title: 'Movies' }} />
    <Tab.Screen name="TvTab" component={TvShowsScreen} options={{ title: 'TV Shows' }} />
    <Tab.Screen name="PeopleTab" component={PeopleScreen} options={{ title: 'People' }} />
    <Tab.Screen
      name="WatchlistTab"
      component={WatchlistScreen}
      options={{ title: 'Watchlist' }}
    />
  </Tab.Navigator>
);

export const RootNavigator = () => {
  // hydrate the watchlist from AsyncStorage, then write changes back
  useWatchlistPersistence();

  return (
    <NavigationContainer theme={navigationTheme}>
      <OfflineBanner />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="Tabs" component={TabsNavigator} />

        <Stack.Screen
          name="CategoryList"
          component={CategoryListScreen}
          options={({ route }) => ({
            headerShown: true,
            title: findCategory(route.params.categoryKey).title,
            headerStyle: styles.header,
            headerTintColor: colors.primary,
            headerTitleStyle: styles.headerTitle,
            headerShadowVisible: false,
          })}
        />

        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        <Stack.Screen name="TvDetail" component={TvDetailScreen} />
        <Stack.Screen name="PersonDetail" component={PersonDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabIconActive: {
    opacity: 1,
  },
  tabIconIdle: {
    opacity: 0.45,
  },
  header: {
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
});
