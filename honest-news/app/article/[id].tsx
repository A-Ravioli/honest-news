import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '../../store';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

const { width } = Dimensions.get('window');

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { articles } = useAppSelector((state) => state.news);
  
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Article not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFactCheckColor = (score: number) => {
    if (score >= 80) return Colors.light.success;
    if (score >= 60) return Colors.light.warning;
    return Colors.light.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Article Image */}
        {article.urlToImage && (
          <Image source={{ uri: article.urlToImage }} style={styles.heroImage} />
        )}

        {/* Article Header */}
        <View style={styles.articleHeader}>
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceName}>{article.source.name}</Text>
            <Text style={styles.publishDate}>{formatDate(article.publishedAt)}</Text>
          </View>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.description}>{article.description}</Text>

          {/* Reading Time & Category */}
          <View style={styles.metadata}>
            <View style={styles.readingTime}>
              <Ionicons name="time-outline" size={16} color={Colors.light.textSecondary} />
              <Text style={styles.metadataText}>{article.readingTime || 5} min read</Text>
            </View>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* AI Summary */}
        {article.aiSummary && (
          <View style={styles.aiSection}>
            <LinearGradient
              colors={[Colors.light.accent + '20', Colors.light.primary + '20']}
              style={styles.aiContainer}
            >
                             <View style={styles.aiHeader}>
                 <Ionicons name="flash" size={20} color={Colors.light.primary} />
                 <Text style={styles.aiTitle}>AI Summary</Text>
               </View>
              <Text style={styles.aiSummary}>{article.aiSummary}</Text>
            </LinearGradient>
          </View>
        )}

        {/* Scale Context */}
        {article.scaleContext && (
          <View style={styles.scaleSection}>
            <View style={styles.scaleHeader}>
              <Ionicons name="resize-outline" size={20} color={Colors.light.warning} />
              <Text style={styles.scaleTitle}>Scale Context</Text>
            </View>
            <Text style={styles.scaleText}>{article.scaleContext}</Text>
          </View>
        )}

        {/* Fact Check */}
        {article.factCheck && (
          <View style={styles.factCheckSection}>
            <View style={styles.factCheckHeader}>
              <Ionicons name="checkmark-circle-outline" size={20} color={getFactCheckColor(article.factCheck.score)} />
              <Text style={styles.factCheckTitle}>Fact Check</Text>
              <View style={[styles.scoreCircle, { borderColor: getFactCheckColor(article.factCheck.score) }]}>
                <Text style={[styles.scoreText, { color: getFactCheckColor(article.factCheck.score) }]}>
                  {article.factCheck.score}
                </Text>
              </View>
            </View>
            <Text style={styles.factCheckDetails}>
              {article.factCheck.verifiedClaims} of {article.factCheck.totalClaims} claims verified
            </Text>
            <View style={styles.sources}>
              <Text style={styles.sourcesTitle}>Sources:</Text>
              {article.factCheck.sources.map((source, index) => (
                <Text key={index} style={styles.sourceItem}>• {source}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Article Content */}
        <View style={styles.contentSection}>
          <Text style={styles.articleContent}>{article.content}</Text>
        </View>

        {/* Source Credibility */}
        {article.source.credibilityScore && (
          <View style={styles.credibilitySection}>
            <Text style={styles.credibilityTitle}>Source Credibility</Text>
            <View style={styles.credibilityBar}>
              <View 
                style={[
                  styles.credibilityFill, 
                  { width: `${article.source.credibilityScore}%` }
                ]} 
              />
            </View>
            <Text style={styles.credibilityScore}>
              {article.source.credibilityScore}/100 credibility score
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: Theme.spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: Theme.spacing.sm,
    marginLeft: Theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: width,
    height: 250,
    backgroundColor: Colors.light.border,
  },
  articleHeader: {
    padding: Theme.spacing.lg,
  },
  sourceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  sourceName: {
    fontSize: Theme.typography.fontSizes.caption,
    fontWeight: Theme.typography.fontWeights.semibold,
    color: Colors.light.primary,
    textTransform: 'uppercase',
  },
  publishDate: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.textSecondary,
  },
  title: {
    fontSize: Theme.typography.fontSizes.title,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    lineHeight: Theme.typography.lineHeights.tight * Theme.typography.fontSizes.title,
    marginBottom: Theme.spacing.sm,
  },
  description: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.textSecondary,
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.fontSizes.body,
    marginBottom: Theme.spacing.md,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  category: {
    backgroundColor: Colors.light.accent + '20',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: Theme.typography.fontSizes.caption,
    fontWeight: Theme.typography.fontWeights.semibold,
    color: Colors.light.accent,
  },
  aiSection: {
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  aiContainer: {
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  aiTitle: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.semibold,
    color: Colors.light.primary,
    marginLeft: Theme.spacing.sm,
  },
  aiSummary: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.text,
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.fontSizes.body,
  },
  scaleSection: {
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
    backgroundColor: Colors.light.warning + '10',
    borderRadius: Theme.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.warning,
  },
  scaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  scaleTitle: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.semibold,
    color: Colors.light.warning,
    marginLeft: Theme.spacing.sm,
  },
  scaleText: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.text,
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.fontSizes.body,
  },
  factCheckSection: {
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  factCheckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  factCheckTitle: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.semibold,
    color: Colors.light.text,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: Theme.typography.fontSizes.body,
    fontWeight: Theme.typography.fontWeights.bold,
  },
  factCheckDetails: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  sources: {
    marginTop: Theme.spacing.sm,
  },
  sourcesTitle: {
    fontSize: Theme.typography.fontSizes.caption,
    fontWeight: Theme.typography.fontWeights.semibold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.xs,
  },
  sourceItem: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  contentSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  articleContent: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.text,
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.fontSizes.body,
  },
  credibilitySection: {
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xxl,
    padding: Theme.spacing.lg,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Theme.borderRadius.lg,
  },
  credibilityTitle: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.semibold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.sm,
  },
  credibilityBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    marginBottom: Theme.spacing.sm,
  },
  credibilityFill: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 4,
  },
  credibilityScore: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.textSecondary,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: Theme.typography.fontSizes.headline,
    color: Colors.light.textSecondary,
  },
}); 