import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

import { AppDispatch, RootState } from '../store';
import { fetchBooks } from '../store/slices/booksSlice';
import { Book } from '../types/book';
import SearchBar from '../components/SearchBar';
import BookListItem from '../components/BookListItem';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import { useThemeColors } from '../styles/theme';

type SearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabScreenProps<MainTabParamList, 'Discover'>['navigation'],
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: SearchScreenNavigationProp;
};

const BooksSearchScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState('');

  const {
    items,
    searchQuery,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    startIndex,
  } = useSelector((state: RootState) => state.books);
  
  const user = useSelector((state: RootState) => state.auth.user);

  const colors = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedQuery = query.trim();
      
      if (trimmedQuery.length < 2) {
        if (searchQuery !== 'subject:fiction') {
          dispatch(fetchBooks({ query: 'subject:fiction', startIndex: 0 }));
        }
      } else if (trimmedQuery !== searchQuery) {
        dispatch(fetchBooks({ query: trimmedQuery, startIndex: 0 }));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, dispatch, searchQuery]);

  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && !isLoading && hasMore && items.length > 0) {
      dispatch(fetchBooks({ query: searchQuery, startIndex }));
    }
  }, [dispatch, isLoadingMore, isLoading, hasMore, items.length, searchQuery, startIndex]);

  const handleRetry = useCallback(() => {
    dispatch(fetchBooks({ query: searchQuery, startIndex: 0 }));
  }, [dispatch, searchQuery]);

  const renderItem = useCallback(({ item }: { item: Book }) => (
    <BookListItem
      book={item}
      onPress={() => {
        navigation.navigate('BookDetail', { book: item });
      }}
    />
  ), [navigation]);

  const keyExtractor = useCallback((item: Book, index: number) => `${item.id}-${index}`, []);

  const renderEmptyState = () => {
    if (isLoading) return null;
    
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Oops! Something went wrong.</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (query.trim().length < 2) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Results Found</Text>
        <Text style={styles.emptySubtitle}>We couldn't find any books matching "{query}".</Text>
      </View>
    );
  };

  const displayName = user?.name || 'Reader';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.helloText}>Hello,</Text>
            <Text style={styles.nameText}>{displayName}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search books, authors, genres..."
        />

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>
            {query.trim().length < 2 ? 'Top Picks for You' : 'Search Results'}
          </Text>
        </View>

        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={items.length === 0 ? { flexGrow: 1 } : styles.listContent}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator style={styles.footerLoader} size="small" color={colors.accent} /> : null
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />

        {isLoading && items.length === 0 && (
          <View style={styles.overlayCenter}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  helloText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.accent,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: 20,
  },
  overlayCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background === '#0F172A' ? 'rgba(15,23,42,0.8)' : 'rgba(243,245,251,0.8)', 
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

export default BooksSearchScreen;
