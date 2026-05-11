import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

import { RootState } from '../store';
import BookListItem from '../components/BookListItem';
import { SavedBook } from '../types/book';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import { useThemeColors } from '../styles/theme';

type SavedScreenNavigationProp = CompositeNavigationProp<
  BottomTabScreenProps<MainTabParamList, 'Saved'>['navigation'],
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: SavedScreenNavigationProp;
};

const SavedBooksScreen: React.FC<Props> = ({ navigation }) => {
  const favorites = useSelector((state: RootState) => state.savedBooks.favorites);
  const savedForLater = useSelector((state: RootState) => state.savedBooks.savedForLater);
  
  const colors = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const sections = [
    {
      title: 'Favorites',
      data: favorites,
      emptyMessage: 'No favorites yet.',
    },
    {
      title: 'Saved for Later',
      data: savedForLater,
      emptyMessage: 'No books saved for later.',
    },
  ];

  const totalSaved = favorites.length + savedForLater.length;

  const renderItem = useCallback(({ item }: { item: SavedBook }) => (
    <BookListItem
      book={item.data}
      onPress={() => {
        navigation.navigate('BookDetail', { book: item.data });
      }}
    />
  ), [navigation]);

  const keyExtractor = useCallback((item: SavedBook) => item.id, []);

  const renderSectionHeader = useCallback(({ section: { title } }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  ), [styles]);

  const renderSectionFooter = useCallback(({ section }: any) => {
    if (section.data.length === 0) {
      return (
        <View style={styles.sectionEmpty}>
          <Text style={styles.sectionEmptyText}>{section.emptyMessage}</Text>
        </View>
      );
    }
    return null;
  }, [styles]);

  if (totalSaved === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>You haven't saved any books yet.</Text>
        <Text style={styles.emptySubtitle}>
          Books you favorite or save for later will appear here across all your sessions.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        stickySectionHeadersEnabled={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  sectionHeader: {
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionEmpty: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  sectionEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default SavedBooksScreen;
