import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { ArticleCard } from '../../components/ArticleCard';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

export default function SavedScreen() {
  const { articles } = useAppSelector((state) => state.news);
  
  // Mock saved articles - in real app, this would be filtered by saved status
  const savedArticles = articles.slice(0, 1); // Show only first article as saved for demo

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Articles</Text>
        <Text style={styles.subtitle}>
          Your bookmarked articles for later reading
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {savedArticles.length > 0 ? (
          savedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onPress={() => handleArticlePress(article.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color={Colors.light.textTertiary} />
            <Text style={styles.emptyTitle}>No saved articles yet</Text>
            <Text style={styles.emptySubtext}>
              Bookmark articles from the home feed to read them later
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
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
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.fontSizes.body,
  },
}); 