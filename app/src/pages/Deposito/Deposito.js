import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import React, { useEffect, useState } from "react";
import {useAuthStore} from '../../stores/authStore/index';



export default function Deposito() {
    const navigation = useNavigation();

    const accessToken = useAuthStore(state => state.accessToken);

    const [valor, setValor] = useState(null)

    useEffect(() => {
        axios.get('https://11a9-189-57-188-42.ngrok-free.app/api/token/',
            {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }
        ).then((response) => 
            console.log(accessToken)

        )
        .catch((e) => {
            console.log(e.response);
        })

        
    })

    async function dep(){
        if (valor != null && valor != "" && valor != 0){

            await axios.post("https://11a9-189-57-188-42.ngrok-free.app/api/conta/depositar",{
                "value": valor
            }, {
                headers: {
                    Authorization: "Bearer " + accessToken
            }})
            .then((response)=> {
                console.log(response.data)
                navigation.navigate('Confirmacao')
            })
    }else{
        alert('Valor inválido')
    }}

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.txt}>Deposito</Text>

                    <Text style={styles.title}>Valor a depositar</Text>
                    <TextInput 
                    placeholder=" R$ 0,00"
                    style={styles.input}
                    onChangeText={(text) => setValor(text)}
                    value={valor}
                    />
                </View>

                <TouchableOpacity style={styles.prop} onPress={dep}>
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

    title:{
        fontSize:20,
        marginTop:28,
        color:'white',
        marginLeft:85
    },

    input:{
        borderBottomWidth:1,
        height:40,
        marginBottom:12,
        fontSize:16,
        backgroundColor:'white',
        width:'60%',
        marginLeft:85,
        borderRadius:10
    },

})