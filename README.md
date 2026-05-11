# BookFinder 📚

A production-ready React Native (CLI) application built to discover, search, and save books using the Google Books API. The app demonstrates advanced architecture, strict TypeScript usage, robust state management, and an emphasis on performance and clean UX without relying on third-party UI libraries.

## 📱 App Functionality

- **Secure Authentication:** Firebase Email/Password & Native Google Sign-In support.
- **Discover & Search:** Search millions of books via the Google Books API. The search bar includes a 500ms debounce to prevent API spam and optimize performance.
- **Infinite Scrolling:** FlatList implementation with `onEndReached` pagination to continually fetch the next 20 books dynamically.
- **Save for Later:** Users can save their favorite books to a local library.
- **Persistent State:** Uses `redux-persist` and `AsyncStorage` to ensure that saved books, user preferences, and onboarding states survive app restarts and device reboots.
- **Global Theme Support:** Fully custom light and dark mode implementation managed globally via Redux, automatically reflecting throughout the UI.
- **Native Polish:** Custom Bootsplash launch screen and generated mipmap application icons for a true native feel.

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v22+)
- React Native CLI environment setup (Android Studio / Xcode)
- Ruby & CocoaPods (for iOS)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/BookFinder.git
   cd BookFinder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. *(iOS Only)* Install CocoaPods:
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App
Start the Metro Bundler:
```bash
npm start
```

Launch the Android/iOS application:
```bash
# For Android
npx react-native run-android

# For iOS
npx react-native run-ios
```

### 📦 Installing via APK (Android)
If you don't want to set up the React Native development environment, you can install the pre-compiled `.apk` file directly:
1. Download the `app-release.apk` file from the repository releases or deployment link.
2. Transfer the `.apk` file to your Android device (via USB, Google Drive, or Email).
3. On your Android device, open a File Manager and tap the `.apk` file to install it.
   - *Note: You may need to enable "Install Unknown Apps" in your Android settings.*
4. Launch the **BookFinder** app from your home screen!

## 🧠 Key Technical Decisions

1. **No Third-Party UI Libraries:** To demonstrate deep understanding of the core React Native ecosystem, the entire user interface was constructed using bare standard components (`View`, `Text`, `FlatList`, `TextInput`, `StyleSheet`). No UI Kitten, NativeBase, or external vector icons were used.
2. **Redux Toolkit + Redux Persist:** Chosen for scalable state management. The store is modularized into slices (`auth`, `books`, `savedBooks`, `theme`). `redux-persist` was critical for achieving the requirement of restoring content after a complete app kill.
3. **FlatList Performance Optimization:** The Discover screen implements `initialNumToRender`, `windowSize`, and `removeClippedSubviews` to guarantee a consistent 60fps scrolling experience even when the Redux store holds hundreds of fetched API objects. 
4. **Memoization:** Extensive use of `useCallback` (for `renderItem` and `keyExtractor`) and `useMemo` (for the dynamic Theme hooks) prevents unnecessary re-renders of list items and heavy UI components.
5. **Decoupled API Layer:** The Google Books API token and fetch logic are isolated in a dedicated `api/` directory, rather than bleeding into the Redux Thunks. This ensures the architecture is cleanly separated.

## 💡 Improvements with More Time

Given additional time, I would implement the following features:

1. **Firestore Cloud Sync:** Currently, "Saved Books" are persisted purely locally via `AsyncStorage`. I would integrate Cloud Firestore to sync the user's library across multiple devices using their Firebase Auth UID.
2. **Comprehensive Testing:** Add unit testing for the Redux reducers and thunks using `Jest`, and component snapshot testing via `@testing-library/react-native`.
3. **Advanced Offline Support:** Implement `NetInfo` to detect when the device loses network connectivity, seamlessly switching the app into an "Offline Mode" that allows users to read the descriptions of their locally cached saved books without crashing or showing endless loading spinners.
4. **Shared Element Transitions:** Use `react-native-reanimated` to create fluid 60fps image transitions when a user clicks a book thumbnail in the Discover feed and navigates into the Detail screen.
