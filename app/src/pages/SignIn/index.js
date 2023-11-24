import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import { api } from "../../services/api";
import { useAuthStore } from "../../stores/authStore";
import { useState } from "react";
import axios from "axios";


export default function SignIn() {
    const navigation = useNavigation();

    const setAccessToken = useAuthStore(state => state.setAccessToken);
    const setRefreshToken = useAuthStore(state => state.setRefreshToken);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function log() {

        await axios.post('https://d000-189-57-188-42.ngrok-free.app/api/token/', {
            "email": email,
            "password": password
        })
        .then((response) => {
            const accessToken = response.data.access;
            const refreshToken = response.data.refresh;
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            navigation.navigate('Inicial')
        })
        .catch((e) => {
            console.log(e.response);
        })
    }

    return(
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Bem-Vindo(a)</Text>
            </Animatable.View>
            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput 
                 placeholder="Digite seu email"
                 style={styles.input}
                 onChangeText={(text) => setEmail(text)}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput 
                 placeholder="Digite sua senha"
                 secureTextEntry={true}
                 style={styles.input}
                 onChangeText={(text) => setPassword(text)}
                />

                <TouchableOpacity style={styles.button} onPress={() => log()}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000040',
    },
    containerHeader:{
        marginTop:'14%',
        marginBottom:'8%',
        paddingStart: '5%',
    },
    message:{
        fontSize: 28,
        fontWeight: 'bold',
        color:'white'
    },
    containerForm:{
        backgroundColor:'white',
        flex:1,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title:{
        fontSize:20,
        marginTop:28,
    },
    input:{
        borderBottomWidth:1,
        height:40,
        marginBottom:12,
        fontSize:16
    },
    button:{
        backgroundColor:'#000040',
        width:'100%',
        borderRadius:4,
        paddingVertical:10,
        marginTop:14,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
        color: 'white',
        fontSize: 20,
        fontWeight:'bold'
    },
    buttonRegister:{
        marginTop:14,
        alignSelf:'center'
    },
    registerText:{
        color:'#a1a1a1'
    }
})