import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewsArticle } from '../types';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

interface ArticleCardProps {
  article: NewsArticle;
  onPress: () => void;
  variant?: 'default' | 'featured' | 'compact';
}

const { width } = Dimensions.get('window');

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onPress,
  variant = 'default',
}) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - publishedDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getFactCheckColor = (score: number) => {
    if (score >= 80) return Colors.light.success;
    if (score >= 60) return Colors.light.warning;
    return Colors.light.error;
  };

  const getFactCheckIcon = (score: number) => {
    if (score >= 80) return 'checkmark-circle';
    if (score >= 60) return 'warning';
    return 'alert-circle';
  };

  if (variant === 'featured') {
    return (
      <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
        {article.urlToImage && (
          <Image source={{ uri: article.urlToImage }} style={styles.featuredImage} />
        )}
        <View style={styles.featuredContent}>
          <View style={styles.featuredHeader}>
            <Text style={styles.sourceText}>{article.source.name}</Text>
            <Text style={styles.timeText}>{formatTimeAgo(article.publishedAt)}</Text>
          </View>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {article.title}
          </Text>
          {article.aiSummary && (
            <Text style={styles.summaryText} numberOfLines={2}>
              {article.aiSummary}
            </Text>
          )}
          <View style={styles.indicators}>
            {article.factCheck && (
              <View style={styles.factCheck}>
                <Ionicons
                  name={getFactCheckIcon(article.factCheck.score)}
                  size={16}
                  color={getFactCheckColor(article.factCheck.score)}
                />
                <Text style={[styles.indicatorText, { color: getFactCheckColor(article.factCheck.score) }]}>
                  {article.factCheck.score}% verified
                </Text>
              </View>
            )}
            {article.readingTime && (
              <View style={styles.readingTime}>
                <Ionicons name="time-outline" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.indicatorText}>{article.readingTime} min read</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <View style={styles.compactMeta}>
            <Text style={styles.sourceText}>{article.source.name}</Text>
            <Text style={styles.timeText}>{formatTimeAgo(article.publishedAt)}</Text>
          </View>
        </View>
        {article.urlToImage && (
          <Image source={{ uri: article.urlToImage }} style={styles.compactImage} />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.sourceInfo}>
          <Text style={styles.sourceText}>{article.source.name}</Text>
          <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.timeText}>{formatTimeAgo(article.publishedAt)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={3}>
        {article.title}
      </Text>

      {article.aiSummary && (
        <View style={styles.aiSummaryContainer}>
          <View style={styles.aiLabel}>
            <Ionicons name="flash" size={12} color={Colors.light.accent} />
            <Text style={styles.aiLabelText}>AI Summary</Text>
          </View>
          <Text style={styles.summaryText} numberOfLines={2}>
            {article.aiSummary}
          </Text>
        </View>
      )}

      {article.urlToImage && (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      )}

      <View style={styles.footer}>
        <View style={styles.indicators}>
          {article.scaleContext && (
            <View style={styles.scaleIndicator}>
              <Ionicons name="analytics" size={14} color={Colors.light.primary} />
              <Text style={styles.indicatorText}>Scale Context</Text>
            </View>
          )}
          {article.factCheck && (
            <View style={styles.factCheck}>
              <Ionicons
                name={getFactCheckIcon(article.factCheck.score)}
                size={14}
                color={getFactCheckColor(article.factCheck.score)}
              />
              <Text style={[styles.indicatorText, { color: getFactCheckColor(article.factCheck.score) }]}>
                {article.factCheck.verifiedClaims}/{article.factCheck.totalClaims} verified
              </Text>
            </View>
          )}
          {article.readingTime && (
            <View style={styles.readingTime}>
              <Ionicons name="time-outline" size={14} color={Colors.light.textSecondary} />
              <Text style={styles.indicatorText}>{article.readingTime} min</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  featuredCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.lg,
    overflow: 'hidden',
    ...Theme.shadows.lg,
  },
  compactCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sourceText: {
    fontSize: Theme.typography.fontSizes.caption,
    fontWeight: Theme.typography.fontWeights.medium,
    color: Colors.light.primary,
    marginRight: Theme.spacing.xs,
  },
  categoryText: {
    fontSize: Theme.typography.fontSizes.small,
    color: Colors.light.textTertiary,
    backgroundColor: Colors.light.border,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  timeText: {
    fontSize: Theme.typography.fontSizes.caption,
    color: Colors.light.textSecondary,
  },
  title: {
    fontSize: Theme.typography.fontSizes.subheadline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    lineHeight: Theme.typography.lineHeights.tight * Theme.typography.fontSizes.subheadline,
    marginBottom: Theme.spacing.sm,
  },
  featuredTitle: {
    fontSize: Theme.typography.fontSizes.headline,
    fontWeight: Theme.typography.fontWeights.bold,
    color: Colors.light.text,
    lineHeight: Theme.typography.lineHeights.tight * Theme.typography.fontSizes.headline,
    marginBottom: Theme.spacing.sm,
  },
  compactTitle: {
    fontSize: Theme.typography.fontSizes.body,
    fontWeight: Theme.typography.fontWeights.medium,
    color: Colors.light.text,
    lineHeight: Theme.typography.lineHeights.normal * Theme.typography.fontSizes.body,
    marginBottom: Theme.spacing.xs,
  },
  aiSummaryContainer: {
    backgroundColor: Colors.light.background,
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.accent,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  aiLabelText: {
    fontSize: Theme.typography.fontSizes.small,
    fontWeight: Theme.typography.fontWeights.medium,
    color: Colors.light.accent,
    marginLeft: Theme.spacing.xs,
  },
  summaryText: {
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.textSecondary,
    lineHeight: Theme.typography.lineHeights.normal * Theme.typography.fontSizes.body,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
  },
  featuredImage: {
    width: '100%',
    height: 250,
  },
  compactImage: {
    width: 80,
    height: 60,
    borderRadius: Theme.borderRadius.sm,
    marginLeft: Theme.spacing.sm,
  },
  featuredContent: {
    padding: Theme.spacing.md,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  compactContent: {
    flex: 1,
  },
  compactMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Theme.spacing.sm,
  },
  indicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scaleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorText: {
    fontSize: Theme.typography.fontSizes.small,
    color: Colors.light.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
}); 