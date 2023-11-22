import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";


export default function Inicial() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInUp" delay={500}>
                <Text style={styles.txt}>Olá, Usuário</Text>

                <Animatable.Image
                    animation="fadeInUp"
                    source={require('../../assets/cartao.png')}
                    style={{ width: '100%', marginTop: 20}}
                    resizeMode="contain"
                />
            </Animatable.View>
            <View style={styles.todosbtn}>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('Pix')}>
                    <Image 
                        source={require('../../assets/pix.png')}
                        style={{width:50, height:50, flex:1}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('CodigoBarra')}>
                    <Image 
                        source={require('../../assets/codigo.png')}
                        style={{width:40, height:40, flex:1, marginLeft:5}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('Transf')}>
                    <Image 
                        source={require('../../assets/transf.jpg')}
                        style={{width:50, height:50, flex:1, borderRadius:50}}
                        resizeMode="contain"
                     /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('Deposito')}>
                    <Image 
                         source={require('../../assets/dep.png')}
                        style={{width:50, height:50, flex:1}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('Emprestimo')}>
                    <Image 
                        source={require('../../assets/emp.png')}
                        style={{width:50, height:50, flex:1}}
                        resizeMode="contain"
                    /> 
                </TouchableOpacity>
                </View>
            <TouchableOpacity style={styles.prop}>
                <Text style={styles.txtTitle}>Investimento</Text>
                <Text style={styles.txtDesc}>Invista de maneira simples, rápida,  sem burocracias e 100% digital.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.prop}>
                <Text style={styles.txtTitle}>Seguro de vida</Text>
                <Text style={styles.txtDesc}>Conheça Trust Bank Vida: Um seguro simples e que cabe no seu bolso.</Text>
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
        width:'95%',
        height:120,
        margin:12,
        borderRadius:20,
        marginTop:25
    },

    txtTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
        marginTop:15
    },

    txtDesc: {
        fontSize: 18,
        color: 'white',
        marginLeft: 10
    },
})