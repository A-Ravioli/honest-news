import React, { useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchNews, refreshNews } from '../../store/slices/newsSlice';
import { setDemoUser } from '../../store/slices/userSlice';
import { router } from 'expo-router';
import { ArticleCard } from '../../components/ArticleCard';
import { Loading } from '../../components/Loading';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { articles, featuredArticles, loading, refreshing, error } = useAppSelector((state) => state.news);
  const { user, isAuthenticated } = useAppSelector((state: any) => state.user);

  useEffect(() => {
    // Set demo user for development
    if (!isAuthenticated) {
      dispatch(setDemoUser());
    }
    
    // Fetch initial news
    dispatch(fetchNews('general'));
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(refreshNews('general'));
  };

  const handleArticlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && articles.length === 0) {
    return <Loading text="Loading latest news..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.accent]}
        style={styles.header}
      >
        <Text style={styles.dateText}>{formatDate()}</Text>
        <Text style={styles.greetingText}>
          {getGreeting()}{user ? `, ${user.name}` : ''}
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.light.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load news: {error}</Text>
          </View>
        )}

        {/* Featured Stories */}
        {featuredArticles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Stories</Text>
            {featuredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="featured"
                onPress={() => handleArticlePress(article.id)}
              />
            ))}
          </View>
        )}

        {/* For You Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For You</Text>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onPress={() => handleArticlePress(article.id)}
            />
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
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
    borderBottomLeftRadius: Theme.borderRadius.xl,
    borderBottomRightRadius: Theme.borderRadius.xl,
  },
  dateText: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.background,
    fontWeight: Theme.typography.fontWeights.medium,
    opacity: 0.9,
  },
  greetingText: {
    fontSize: Theme.typography.fontSizes.headline,
    color: Colors.light.background,
    fontWeight: Theme.typography.fontWeights.bold,
    marginTop: Theme.spacing.xs,
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
  errorContainer: {
    backgroundColor: Colors.light.error,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    margin: Theme.spacing.md,
  },
  errorText: {
    color: Colors.light.background,
    fontSize: Theme.typography.fontSizes.body,
    textAlign: 'center',
  },
});
