import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store';
import { ArticleCard } from '../../components/ArticleCard';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { articles, topics } = useAppSelector((state) => state.news);

  const handleSearch = () => {
    console.log('Search for:', searchQuery);
  };

  const handleArticlePress = (articleId: string) => {
    console.log('Navigate to article:', articleId);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingTopics = topics.filter(topic => topic.trending);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search news, topics, sources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor={Colors.light.textTertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trending Topics */}
        {trendingTopics.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Topics</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {trendingTopics.map((topic) => (
                <TouchableOpacity key={topic.id} style={styles.trendingChip}>
                  <Text style={styles.trendingIcon}>{topic.icon}</Text>
                  <Text style={styles.trendingText}>{topic.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search Results or All Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${filteredArticles.length})` : 'Discover More'}
          </Text>
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="compact"
              onPress={() => handleArticlePress(article.id)}
            />
          ))}
          {filteredArticles.length === 0 && searchQuery && (
            <View style={styles.noResults}>
              <Ionicons name="search" size={48} color={Colors.light.textTertiary} />
              <Text style={styles.noResultsText}>No articles found</Text>
              <Text style={styles.noResultsSubtext}>Try adjusting your search terms</Text>
            </View>
          )}
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
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    fontSize: Theme.typography.fontSizes.headline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
  },
  section: {
    marginVertical: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.md,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.xl,
    marginRight: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  trendingIcon: {
    fontSize: 16,
    marginRight: Theme.spacing.xs,
  },
  trendingText: {
    fontSize: Theme.typography.fontSizes.body,
    fontWeight: Theme.typography.fontWeights.medium,
    color: Colors.light.text,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  noResultsText: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.medium,
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  noResultsSubtext: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.textTertiary,
    textAlign: 'center',
  },
}); 