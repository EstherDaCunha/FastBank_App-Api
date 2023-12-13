import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from 'expo-barcode-scanner';



export default function CodigoBarra() {
  const [hasPermission, setHasPermission] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState("");
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScan = ({ data }) => {
    if (!scannedBarcode) {
      setScannedBarcode(data);
    }
  };

  const resetScanner = () => {
    setScannedBarcode(null);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permissão para acessar a câmera foi negada.</Text>;
  }

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {scannedBarcode ? (
        <View style={styles.barcodeContainer}>
          <Text style={styles.barcodeText}>
            Código de barras lido: {scannedBarcode}
          </Text>
          <TouchableOpacity style={styles.button} onPress={resetScanner}>
            <Text style={styles.buttonText}>Escanear novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={handleBarcodeScan}
        />
      )}

      <TouchableOpacity style={styles.prop} onPress={() => navigation.navigate('Inicial')}>
        <Text style={styles.txtTitle}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeContainer: {
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 18,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#000040',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000040',
    fontSize: 16,
  },

  prop: {
    backgroundColor: '#5F2DA8',
    width: '80%',
    height: 50,
    marginLeft: 10,
    borderRadius: 20,
    marginTop: '160%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  txtTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
