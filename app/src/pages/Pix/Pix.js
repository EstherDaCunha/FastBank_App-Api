import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";


export default function Pix() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInUp" delay={500}>
                <Text style={styles.txt}>Pix</Text>

                <Animatable.Image
                    animation="fadeInUp"
                    source={require('../../assets/cartao.png')}
                    style={{ width: '100%', marginTop: 20}}
                    resizeMode="contain"
                />
            </Animatable.View>
            <View style={styles.todosbtn}>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('PixCpf')}>
                    <Image 
                        source={require('../../assets/cpf.png')}
                        style={{width:50, height:50, flex:1}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('PixCelular')}>
                    <Image 
                        source={require('../../assets/celular.png')}
                        style={{width:40, height:40, flex:1, marginLeft:5}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('PixCodigo')}>
                    <Image 
                        source={require('../../assets/qr.png')}
                        style={{width:40, height:40, flex:1, marginLeft:5}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('PixCnpj')}>
                    <Image 
                        source={require('../../assets/cnpj.png')}
                        style={{width:40, height:40, flex:1, marginLeft:3}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('PixChave')}>
                    <Image 
                        source={require('../../assets/chave.jpg')}
                        style={{width:50, height:50, flex:1, borderRadius:50}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.prop}>
                <Text style={styles.txtTitle}>Gerar Chave Aleatória</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.prop}>
                <Text style={styles.txtTitle}>Limites pix</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.prop}>
                <Text style={styles.txtTitle}>Gerenciar contatos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.prop}>
                <Text style={styles.txtTitle}>Noificações</Text>
            </TouchableOpacity>
        </View>
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
    btnPix: {
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius:100,
        margin:5,
        padding:5
    },

    todosbtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 27,
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