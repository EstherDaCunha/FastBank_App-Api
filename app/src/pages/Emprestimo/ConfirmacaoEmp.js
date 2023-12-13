import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";


export default function ConfirmacaoEmp() {
    const route = useRoute();

    const navigation = useNavigation();

    console.log(message)

    return(
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                 <Image
                    source={require('../../assets/logo.png')}
                    style={{width: '100%'}}
                    resizeMode="contain"
                 />
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>{message}</Text>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inicial')}>
                    <Text style={styles.buttonText}>Finalizar</Text>
                </TouchableOpacity>
            </Animatable.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000040'
    },
    containerLogo:{
        flex:2,
        backgroundColor:'#000040',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerForm:{
        flex:1,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop:28,
        marginBottom: 12,
    },
    text:{
        color: '#a1a1a1',
    },
    button:{
      position: 'absolute',
      backgroundColor:'#000040',
      borderRadius:50,  
      paddingVertical: 8,
      width: '60%',
      alignSelf: 'center',
      bottom: '15%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText:{
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold'
    }
})
