import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const lightColors = {
  background: '#F3F5FB',   // page background
  card: '#FFFFFF',         // card background
  textPrimary: '#0F172A',  // dark text
  textSecondary: '#6B7280',// muted text
  accent: '#123B87',       // deep blue for bottom bar & buttons
  borderSubtle: '#E5E7EB', // light borders/dividers
};

export const darkColors = {
  background: '#0F172A',   // dark background
  card: '#1E293B',         // slightly lighter dark for cards
  textPrimary: '#F8FAFC',  // light text
  textSecondary: '#94A3B8',// muted light text
  accent: '#3B82F6',       // vibrant blue for dark mode
  borderSubtle: '#334155', // dark borders
};

export const radius = {
  card: 16,
  pill: 24,
};

export const useThemeColors = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  return isDarkMode ? darkColors : lightColors;
};
