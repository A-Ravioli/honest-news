import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateUserPreferences } from '../../store/slices/userSlice';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.user);

  const handlePreferenceChange = (key: string, value: any) => {
    dispatch(updateUserPreferences({ [key]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    dispatch(updateUserPreferences({
      notifications: {
        ...user?.preferences?.notifications,
        [key]: value,
      },
    }));
  };

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return Colors.light.warning;
      case 'standard':
        return Colors.light.accent;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getSubscriptionText = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'Premium Subscriber';
      case 'standard':
        return 'Standard Subscriber';
      default:
        return 'Free Account';
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Please log in</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={[styles.subscriptionBadge, { backgroundColor: getSubscriptionBadgeColor(user.subscriptionTier) }]}>
                <Text style={styles.subscriptionText}>
                  {getSubscriptionText(user.subscriptionTier)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reading Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Detail Level</Text>
            <View style={styles.segmentedControl}>
              {['brief', 'standard', 'comprehensive'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.segment,
                    user.preferences.detailLevel === level && styles.segmentActive,
                  ]}
                  onPress={() => handlePreferenceChange('detailLevel', level)}
                >
                  <Text style={[
                    styles.segmentText,
                    user.preferences.detailLevel === level && styles.segmentTextActive,
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Dark Mode</Text>
            <Switch
              value={user.preferences.darkMode}
              onValueChange={(value) => handlePreferenceChange('darkMode', value)}
              trackColor={{ false: Colors.light.border, true: Colors.light.accent }}
              thumbColor={Colors.light.background}
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.preferenceLabel}>Breaking News</Text>
              <Text style={styles.notificationDesc}>Get notified about major news events</Text>
            </View>
            <Switch
              value={user.preferences.notifications.breakingNews}
              onValueChange={(value) => handleNotificationChange('breakingNews', value)}
              trackColor={{ false: Colors.light.border, true: Colors.light.accent }}
              thumbColor={Colors.light.background}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.preferenceLabel}>Daily Digest</Text>
              <Text style={styles.notificationDesc}>Morning summary of top stories</Text>
            </View>
            <Switch
              value={user.preferences.notifications.dailyDigest}
              onValueChange={(value) => handleNotificationChange('dailyDigest', value)}
              trackColor={{ false: Colors.light.border, true: Colors.light.accent }}
              thumbColor={Colors.light.background}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.preferenceLabel}>Topic Updates</Text>
              <Text style={styles.notificationDesc}>Updates on your followed topics</Text>
            </View>
            <Switch
              value={user.preferences.notifications.topicUpdates}
              onValueChange={(value) => handleNotificationChange('topicUpdates', value)}
              trackColor={{ false: Colors.light.border, true: Colors.light.accent }}
              thumbColor={Colors.light.background}
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="card-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.actionText}>Manage Subscription</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.actionText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.actionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
            <Ionicons name="log-out-outline" size={24} color={Colors.light.error} />
            <Text style={[styles.actionText, { color: Colors.light.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: Colors.light.cardBackground,
    padding: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.background,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.xs,
  },
  userEmail: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  subscriptionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  subscriptionText: {
    fontSize: Theme.typography.fontSizes.caption,
    fontWeight: Theme.typography.fontWeights.medium,
    color: Colors.light.background,
  },
  section: {
    backgroundColor: Colors.light.cardBackground,
    marginTop: Theme.spacing.md,
    padding: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.lg,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  preferenceLabel: {
    fontSize: Theme.typography.fontSizes.body,
    fontWeight: Theme.typography.fontWeights.medium,
    color: Colors.light.text,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.light.border,
    borderRadius: Theme.borderRadius.md,
    padding: 2,
  },
  segment: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  segmentActive: {
    backgroundColor: Colors.light.primary,
  },
  segmentText: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.textSecondary,
  },
  segmentTextActive: {
    color: Colors.light.background,
    fontWeight: Theme.typography.fontWeights.medium,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationDesc: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  actionText: {
    flex: 1,
    fontSize: Theme.typography.fontSizes.body,
    fontWeight: Theme.typography.fontWeights.medium,
    color: Colors.light.text,
    marginLeft: Theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.textSecondary,
  },
}); 