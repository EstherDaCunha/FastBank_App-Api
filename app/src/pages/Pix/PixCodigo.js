import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';


export default function PixCodigo() {
    const navigation = useNavigation();
    const camera = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                getBlobFroUri(result.assets[0].uri)
                setImage(result.assets[0].uri)
                const path = result.assets[0].uri
                setImagem(path.substring(path.lastIndexOf('/') + 1, path.length))
            }
        } catch (E) {
            console.log(E);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.txt}>Pix - CPF</Text>

                    <Image
                        source={require('../../assets/cartao.png')}
                        style={{ width: '100%', marginTop: 20}}
                        resizeMode="contain"
                    />
                </View>

                <TouchableOpacity onPress={camera}>
                    <Image 
                        source={require('../../assets/camera.png')}
                        style={{width:100, height:100, margin:150}}
                    />
                </TouchableOpacity>


                <TouchableOpacity style={styles.prop} onPress={() => navigation.navigate('Inicial')}>
                    <Text style={styles.txtTitle}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000040',
    },
    txt: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 50,
        marginLeft: 15,
    },

    prop: {
        backgroundColor: '#5F2DA8',
        width:'80%',
        height:50,
        marginLeft:40,
        borderRadius:20,
        marginTop:25,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },

    txtTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },

})