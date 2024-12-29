import React, { useRef, useState, useEffect } from 'react';
import { BackHandler, StyleSheet, View, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const handleBackPress = () => {
      if (canGoBack) {
        webViewRef.current.goBack(); // Go back in WebView's history
        return true; // Prevent app from closing
      }
      return false; // Allow app to close
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [canGoBack]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://geetauniversity.com' }}
        style={{ flex: 1 }}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
