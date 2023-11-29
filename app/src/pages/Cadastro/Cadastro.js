import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

export default function Transf() {
    const navigation = useNavigation();
    const [nome, setNome] = useState("");
    const [dataNasc, setDataNasc] = useState("");
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");

    const reg = async () => {
        const teste = {
            "name": nome,
            "dataNasc": dataNasc,
            "email": email,
            "password": password
        }
        console.log(teste)
        
        await fetch("https://3139-189-57-188-42.ngrok-free.app/api/usuarios/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teste),
        })
        .then((response) => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error.response))
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                
                <Animatable.Image
                    animation="flipInY"
                    source={require('../../assets/camera.png')}
                    style={{ width: '100%', top: '20%' }}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Nome Completo</Text>
                <TextInput
                    placeholder=" Digite o nome"
                    onChangeText={(nome) => setNome(nome)}
                    value={nome}
                    style={styles.input}
                />

                <Text style={styles.title}>Data de nascimento</Text>
                <TextInput
                    placeholder="xx/xx/xx"
                    onChangeText={(dataNasc) => setDataNasc(dataNasc)}
                    value={dataNasc}
                    style={styles.input}
                />

                <Text style={styles.title}>Email</Text>
                <TextInput
                    placeholder="Digite o e-mail do titular"
                    onChangeText={(email) => setEmail(email)}
                    value={email}
                    style={styles.input}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    placeholder="Crie uma senha"
                    onChangeText={(password) => setpassword(password)}
                    value={password}
                    style={styles.input}
                />

                <TouchableOpacity style={styles.prop} onPress={reg}>
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
        width: '80%',
        height: 50,
        marginLeft: 40,
        borderRadius: 20,
        marginTop: 170,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    txtTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },

    title: {
        fontSize: 20,
        marginTop: 28,
        color: 'white',
        marginLeft: 85,
        top: '20%'
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: 'white',
        width: '60%',
        marginLeft: 85,
        borderRadius: 10,
        top: '20%'
    },
})