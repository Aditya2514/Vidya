import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, updateProfile } from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { setUser } from '../store/slices/authSlice';
import { useThemeColors, radius } from '../styles/theme';

GoogleSignin.configure({
  webClientId: '580959714917-eh3c01bdcd29ks2ln4bi7nfh2l9fubct.apps.googleusercontent.com',
});

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const colors = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const authInstance = getAuth();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(authInstance, email, password);
      } else {
        if (!name) {
          Alert.alert('Error', 'Please enter your full name.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        
        dispatch(setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: name
        }));
      }
    } catch (error: any) {
      Alert.alert('Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult: any = await GoogleSignin.signIn();
      const idToken = signInResult?.data?.idToken || signInResult?.idToken;
      
      if (!idToken) {
        throw new Error('No ID token found');
      }
      
      const authInstance = getAuth();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(authInstance, googleCredential);
      
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || 'Google User'
      }));
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED || error.code === statusCodes.IN_PROGRESS) {
        // User cancelled the login flow, do not show an error alert
        console.log('User cancelled Google Sign In');
      } else {
        Alert.alert('Google Sign-In Failed', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Book Finder</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Welcome back! Log in to continue.' : 'Create an account to get started.'}</Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Favorite Book Genre (Optional)"
                placeholderTextColor={colors.textSecondary}
                value={genre}
                onChangeText={setGenre}
              />
            </>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchButtonText}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress} disabled={loading}>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: radius.card,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    paddingHorizontal: 12,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  googleButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
