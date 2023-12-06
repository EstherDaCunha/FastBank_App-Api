import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import {useAuthStore} from '../../stores/authStore/index';

export default function Transf() {
    const navigation = useNavigation();

    const accessToken = useAuthStore(state => state.accessToken);

    const [destino, setDestino] = useState(null)
    const [origem, setOrigem] = useState(null)
    const [cartao, setCartao] = useState(null)
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

    async function transf(){
        if (valor != null && valor != "" && valor != 0){

            await axios.post("https://11a9-189-57-188-42.ngrok-free.app/api/transacao/",{
                "conta_destino": destino,
                "conta_origem": origem,
                "cartao": cartao,
                "valor": valor
            }, {
                headers: {
                    Authorization: "Bearer " + accessToken
            }})
            .then((response)=> {
                console.log(response.data)
            })
    }else{
        alert('Valor inválido')
    }}


   

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.txt}>Transferência</Text>

                    <Image
                        source={require('../../assets/cartao.png')}
                        style={{ width: '100%', marginTop: 20}}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Para</Text>
                    <TextInput 
                    placeholder="Digite o ID da conta destino"
                    style={styles.input} 
                    onChangeText={(text) => setDestino(text)}
                    value={destino}
                    />

                    <Text style={styles.title}>Valor</Text>
                    <TextInput 
                    placeholder=" R$ 0,00"
                    style={styles.input} 
                    onChangeText={(text) => setValor(text)}
                    value={valor}
                    />

                    <Text style={styles.title}>Conta</Text>
                    <TextInput 
                    placeholder="Digite o ID da conta de origem"
                    style={styles.input} 
                    onChangeText={(text) => setOrigem(text)}
                    value={origem}
                    />

                    <Text style={styles.title}>Cartão</Text>
                    <TextInput 
                    placeholder="Cartão"
                    style={styles.input} 
                    onChangeText={(text) => setCartao(text)}
                    value={cartao}
                    />

                    <Text style={styles.title}>Taxa de 3,50</Text>


                <TouchableOpacity style={styles.prop} onPress={transf}>
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