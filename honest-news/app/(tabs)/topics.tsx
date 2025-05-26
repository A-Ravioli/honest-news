import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

export default function TopicsScreen() {
  const { topics } = useAppSelector((state) => state.news);

  const handleTopicPress = (topicId: string) => {
    console.log('Navigate to topic:', topicId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore Topics</Text>
          <Text style={styles.subtitle}>
            Stay updated on the topics that matter to you
          </Text>
        </View>

        <View style={styles.topicsGrid}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[styles.topicCard, topic.trending && styles.trendingCard]}
              onPress={() => handleTopicPress(topic.id)}
            >
              <Text style={styles.topicIcon}>{topic.icon}</Text>
              <Text style={styles.topicName}>{topic.name}</Text>
              <Text style={styles.topicCount}>{topic.articleCount} articles</Text>
              {topic.trending && (
                <View style={styles.trendingBadge}>
                  <Ionicons name="trending-up" size={12} color={Colors.light.warning} />
                  <Text style={styles.trendingText}>Trending</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: Theme.spacing.md,
  },
  header: {
    marginVertical: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSizes.headline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.textSecondary,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCard: {
    width: '48%',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  trendingCard: {
    borderWidth: 2,
    borderColor: Colors.light.warning,
  },
  topicIcon: {
    fontSize: 32,
    marginBottom: Theme.spacing.sm,
  },
  topicName: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  topicCount: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    marginTop: Theme.spacing.xs,
  },
  trendingText: {
    fontSize: Theme.typography.fontSizes.small,
    color: Colors.light.warning,
    fontWeight: Theme.typography.fontWeights.medium,
    marginLeft: Theme.spacing.xs,
  },
}); 