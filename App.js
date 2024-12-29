import React, { useRef, useState, useEffect } from 'react';
import { BackHandler, StyleSheet, View, StatusBar, Modal, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as LocalAuthentication from 'expo-local-authentication';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [authenticated, setAuthenticated] = useState(false); // State to handle authentication
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
        setShowModal(true); // Show custom modal if authentication fails
      }
    } else {
      Alert.alert('Fingerprint authentication is not supported on this device.');
    }
  };

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://geetauniversity.com' }}
        style={{ flex: 1 }}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />

      {/* Custom Modal Alert */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ohh! Failed</Text>
            <Text style={styles.modalMessage}>Please authenticate to continue.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setShowModal(false); checkBiometricAuthentication(); }}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#24695c',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#24695c',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
