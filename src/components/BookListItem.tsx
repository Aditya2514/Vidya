import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Book } from '../types/book';
import { useThemeColors, radius } from '../styles/theme';

interface BookListItemProps {
  book: Book;
  onPress?: () => void;
}

const BookListItemComponent: React.FC<BookListItemProps> = ({ book, onPress }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${book.title}`}
    >
      {book.thumbnail ? (
        <Image source={{ uri: book.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <Text style={styles.placeholderText}>No Cover</Text>
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        
        {book.authors && book.authors.length > 0 && (
          <Text style={styles.author} numberOfLines={1}>
            {book.authors.join(', ')}
          </Text>
        )}
        
        {book.publishedDate && (
          <Text style={styles.meta}>{book.publishedDate}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.borderSubtle,
    marginRight: 12,
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default React.memo(BookListItemComponent);
