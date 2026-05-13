import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useThemeColors } from '../styles/theme';

type BookReaderRouteProp = RouteProp<RootStackParamList, 'BookReader'>;

type Props = {
  route: BookReaderRouteProp;
  navigation: any;
};

const BookReaderScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookId, title } = route.params;
  const colors = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Google Books Embedded Viewer</title>
        <script type="text/javascript" src="https://www.google.com/books/jsapi.js"></script>
        <script type="text/javascript">
          google.books.load();
          function initialize() {
            var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
            viewer.load('${bookId}', notFound);
          }
          function notFound() {
            document.getElementById('viewerCanvas').innerHTML = 
              "<div style='display:flex; height:100%; align-items:center; justify-content:center; font-family:sans-serif; color:#666;'>Preview not available for this book.</div>";
          }
          google.books.setOnLoadCallback(initialize);
        </script>
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background-color: ${colors.background}; }
          #viewerCanvas { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="viewerCanvas"></div>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.card,
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default BookReaderScreen;
