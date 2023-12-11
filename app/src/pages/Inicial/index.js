import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {useAuthStore} from '../../stores/authStore/index';



export default function Inicial() {
    const navigation = useNavigation();

    const accessToken = useAuthStore(state => state.accessToken);


    useEffect(() => {
        axios.get('https://0c48-189-57-188-42.ngrok-free.app/api/token/',
            {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }
        ).then((response) => 
            console.log(response),
            console.log(accessToken)

        )
        .catch((e) => {
            console.log(e.response);
        })
    })

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInUp" delay={500}>
                <Text style={styles.txt}>Olá, cliente</Text>

                <Animatable.Image
                    animation="fadeInUp"
                    source={require('../../assets/cartao.png')}
                    style={{ width: '100%', marginTop: 20 }}
                    resizeMode="contain"
                />
            </Animatable.View>
            <View style={styles.todosbtn}>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('Pix')}>
                    <Image
                        source={require('../../assets/pix.png')}
                        style={{ width: 50, height: 50, flex: 1 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('CodigoBarra')}>
                    <Image
                        source={require('../../assets/codigo.png')}
                        style={{ width: 40, height: 40, flex: 1, marginLeft: 5 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('Transf')}>
                    <Image
                        source={require('../../assets/transf.jpg')}
                        style={{ width: 50, height: 50, flex: 1, borderRadius: 50 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('Deposito')}>
                    <Image
                        source={require('../../assets/dep.png')}
                        style={{ width: 50, height: 50, flex: 1 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPix} onPress={() => navigation.navigate('Emprestimo')}>
                    <Image
                        source={require('../../assets/emp.png')}
                        style={{ width: 50, height: 50, flex: 1 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.prop} onPress={() => navigation.navigate('Credito')}>
                <Text style={styles.txtTitle}>Solicite seu cartão de crédito</Text>
                <Text style={styles.txtDesc}>Descubra a liberdade financeira com nosso novo cartão de crédito, oferecendo benefícios exclusivos e taxas competitivas.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.prop}>
                <Text style={styles.txtTitle}>Investimento</Text>
                <Text style={styles.txtDesc}>Invista de maneira simples, rápida,  sem burocracias e 100% digital.</Text>
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
        borderRadius: 100,
        margin: 5,
        padding: 5
    },

    todosbtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 27,
    },

    prop: {
        backgroundColor: '#5F2DA8',
        width: '95%',
        height: 140,
        margin: 12,
        borderRadius: 20,
        marginTop: 25
    },

    txtTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
        marginTop: 15
    },

    txtDesc: {
        fontSize: 18,
        color: 'white',
        marginLeft: 10
    },
})