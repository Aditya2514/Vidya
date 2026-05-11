import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AppDispatch, RootState } from '../store';
import { addFavorite, removeFavorite, addSavedForLater, removeSavedForLater } from '../store/slices/savedBooksSlice';
import { useThemeColors } from '../styles/theme';

type BookDetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;

type Props = {
  route: BookDetailRouteProp;
  navigation: any;
};

const BookDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { book } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector((state: RootState) => state.savedBooks.favorites);
  const savedForLater = useSelector((state: RootState) => state.savedBooks.savedForLater);

  const colors = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const isFavorite = favorites.some((b) => b.id === book.id);
  const isSavedForLater = savedForLater.some((b) => b.id === book.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(book.id));
    } else {
      dispatch(addFavorite(book));
    }
  };

  const handleToggleSavedForLater = () => {
    if (isSavedForLater) {
      dispatch(removeSavedForLater(book.id));
    } else {
      dispatch(addSavedForLater(book));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={navigation.goBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail</Text>
          <TouchableOpacity onPress={handleToggleFavorite} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={[styles.headerIcon, isFavorite && styles.headerIconActive]}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: book.thumbnail ?? 'https://via.placeholder.com/150x200?text=No+Cover' }}
          style={styles.cover}
        />

        <View style={styles.infoCard}>
          <Text style={styles.title}>{book.title}</Text>
          {book.authors && book.authors.length > 0 && (
            <Text style={styles.author}>{book.authors.join(', ')}</Text>
          )}
          <Text style={styles.meta}>
            {book.publisher ? `${book.publisher} • ` : ''}
            {book.publishedDate ?? 'Unknown date'}
            {book.pageCount ? ` • ${book.pageCount} pages` : ''}
          </Text>

          {book.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleToggleSavedForLater}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {isSavedForLater ? '✓ Saved for Later' : 'Save for Later'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100, 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingVertical: 8,
  },
  headerIcon: {
    fontSize: 28,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  headerIconActive: {
    color: '#FF3B30', 
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cover: {
    width: '60%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: colors.card,
  },
  infoCard: {
    marginTop: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  author: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  descriptionContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle, 
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default BookDetailScreen;
