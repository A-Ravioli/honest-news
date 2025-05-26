import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  text = 'Loading...',
  size = 'large',
  overlay = false,
}) => {
  const containerStyle = overlay ? styles.overlayContainer : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={Colors.light.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.typography.fontSizes.body,
    color: Colors.light.textSecondary,
    fontWeight: Theme.typography.fontWeights.medium,
  },
}); 