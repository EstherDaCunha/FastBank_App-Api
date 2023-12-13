import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useAuthStore } from '../../stores/authStore/index';
import axios from "axios";


export default function Emprestimo() {
    const navigation = useNavigation();

    const accessToken = useAuthStore(state => state.accessToken);

    const [conta, setConta] = useState(null)
    const [valor_emprest, setvalor_emprest] = useState(null)


    useEffect(() => {
        axios.get('https://26cb-189-57-188-42.ngrok-free.app/api/token/',
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

    async function emp() {
        if (valor_emprest != null && valor_emprest != "" && valor_emprest != 0) {

            await axios.post("https://26cb-189-57-188-42.ngrok-free.app/api/emprestimo/", {
                "valor_emprest": valor_emprest,
                "conta": conta
            }, {
                headers: {
                    Authorization: "Bearer " + "https://26cb-189-57-188-42.ngrok-free.app"
                }
            })
                .then((response) => {
                    console.log(response.data)
                    navigation.navigate('Confirmacao', { message: response})
                })
        } else {
            alert('Valor inválido')
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.txt}>Emprestimo</Text>

                    <Image
                        source={require('../../assets/cartao.png')}
                        style={{ width: '100%', marginTop: 20 }}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Conta</Text>
                <TextInput
                    placeholder="Numero conta"
                    style={styles.input}
                    onChangeText={(text) => setConta(text)}
                    value={conta}
                />

                <Text style={styles.title}>Valor a emprestar</Text>
                <TextInput
                    placeholder="R$"
                    style={styles.input}
                    onChangeText={(text) => setvalor_emprest(text)}
                    value={valor_emprest}
                />

                <Text style={styles.title}>         Juros 4,5% ao mês</Text>


                <TouchableOpacity style={styles.prop} onPress={emp}>
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
        marginTop: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
        marginLeft: 85
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: 'white',
        width: '60%',
        marginLeft: 85,
        borderRadius: 10
    },
})