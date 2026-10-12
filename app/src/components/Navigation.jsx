import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import JobsScreen from '../screens/JobsScreen';
import ResumeLabScreen from '../screens/ResumeLabScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import MockTestScreen from '../screens/MockTestScreen';
import AIChatScreen from '../screens/AIChatScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// ── NEW MODULES FOR 100% WEB PARITY ───────────────────────────────────────────
import CoverLetterScreen from '../screens/CoverLetterScreen';
import RoadmapScreen from '../screens/RoadmapScreen';
import RoleExplorerScreen from '../screens/RoleExplorerScreen';
import SalaryCalculatorScreen from '../screens/SalaryCalculatorScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import LiveInterviewerScreen from '../screens/LiveInterviewerScreen';
import AdminAnalyticsScreen from '../screens/AdminAnalyticsScreen';

const NAV_TABS = [
  { id: 'Dashboard',       label: 'Dashboard',    icon: '🏠' },
  { id: 'Jobs',            label: 'Jobs',         icon: '💼' },
  { id: 'Resume Lab',      label: 'ATS Lab',      icon: '📄' },
  { id: 'Templates',       label: 'Templates',    icon: '🎨' },
  { id: 'Cover Letter',    label: 'Cover Letter', icon: '✍️' },
  { id: 'Roadmap',         label: 'AI Roadmap',   icon: '🗺️' },
  { id: 'Role Explorer',   label: '250+ Roles',   icon: '🧭' },
  { id: 'Salary',          label: 'Salary',       icon: '💰' },
  { id: 'Mock Test',       label: 'Mock Test',    icon: '🎯' },
  { id: 'Flashcards',      label: 'Flashcards',   icon: '🎴' },
  { id: 'Live Interview',  label: 'Live AI Voice',icon: '🎙️' },
  { id: 'AI Advisor',      label: 'AI Chat',      icon: '💬' },
  { id: 'Applications',    label: 'Applied',      icon: '📊' },
  { id: 'Analytics',       label: 'University',   icon: '🏛️' },
  { id: 'Notifications',   label: 'Alerts',       icon: '🔔' },
  { id: 'Profile',         label: 'Profile',      icon: '👤' },
  { id: 'Settings',        label: 'Settings',     icon: '⚙️' },
];

export default function Navigation() {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    // Default session token so all screens can access user context
    AsyncStorage.setItem('session', 'default_session_token');
    AsyncStorage.setItem('user', JSON.stringify({
      id: 'usr_navya_anand',
      name: 'Navya Anand',
      email: 'dilliprasanna1523@gmail.com',
      role: 'Software Engineer',
    }));
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentTab('Dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated && !checkingAuth) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const renderActiveScreen = () => {
    const navProps = { onNavigate: (tab) => setCurrentTab(tab) };
    switch (currentTab) {
      case 'Dashboard':      return <DashboardScreen {...navProps} />;
      case 'Jobs':           return <JobsScreen {...navProps} />;
      case 'Resume Lab':     return <ResumeLabScreen {...navProps} />;
      case 'Templates':      return <TemplatesScreen {...navProps} />;
      case 'Cover Letter':   return <CoverLetterScreen {...navProps} />;
      case 'Roadmap':        return <RoadmapScreen {...navProps} />;
      case 'Role Explorer':  return <RoleExplorerScreen {...navProps} />;
      case 'Salary':         return <SalaryCalculatorScreen {...navProps} />;
      case 'Mock Test':      return <MockTestScreen {...navProps} />;
      case 'Flashcards':     return <FlashcardsScreen {...navProps} />;
      case 'Live Interview': return <LiveInterviewerScreen {...navProps} />;
      case 'AI Advisor':     return <AIChatScreen {...navProps} />;
      case 'Applications':   return <ApplicationsScreen {...navProps} />;
      case 'Analytics':      return <AdminAnalyticsScreen {...navProps} />;
      case 'Notifications':  return <NotificationsScreen {...navProps} />;
      case 'Profile':        return <ProfileScreen {...navProps} />;
      case 'Settings':       return <SettingsScreen onLogout={handleLogout} />;
      default:               return <DashboardScreen {...navProps} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Screen Content */}
      <View style={styles.content}>{renderActiveScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bottomNavScroll}
        >
          {NAV_TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setCurrentTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  content: { flex: 1 },
  bottomNavContainer: {
    backgroundColor: '#0f1729',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  bottomNavScroll: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 64,
  },
  tabButtonActive: {
    backgroundColor: '#2563eb',
  },
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  tabLabelActive: { color: '#ffffff', fontWeight: '800' },
});
