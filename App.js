import React, { useRef, useState, useEffect } from 'react';
import { BackHandler, StyleSheet, View, StatusBar, Alert, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import * as LocalAuthentication from 'expo-local-authentication';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [authenticated, setAuthenticated] = useState(false); // State to handle authentication

  useEffect(() => {
    const checkBiometricAuthentication = async () => {
      // Check if the device supports biometric authentication
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (compatible) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Geeta University', // Message shown during authentication
        });

        if (result.success) {
          setAuthenticated(true); // Authentication successful
        } else {
          Alert.alert('Authentication failed.'); // Authentication failed
        }
      } else {
        Alert.alert('Fingerprint authentication is not supported on this device.');
      }
    };

    checkBiometricAuthentication(); // Run authentication check on app load

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

  if (!authenticated) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Button title="" onPress={() => setAuthenticated(true)} />
      </View>
    );
  }

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
