import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from '../../stores/authStore/index';


export default function Extrato() {
    const accessToken = useAuthStore(state => state.accessToken);

    const [extratoItems, setExtratoItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const tipoIcones = {
        'Deposito': {
            icon: 'arrow-up-circle-outline',
            color: 'green',
        },
        'Saque': {
            icon: 'arrow-down-circle-outline',
            color: 'red',
        },
        'Transferencia': {
            icon: 'swap-horizontal',
            color: 'blue',
        },
        'Emprestimo aprovado': {
            icon: 'checkmark-circle-outline',
            color: 'green',
        },
        'Emprestimo negado': {
            icon: 'close-circle-outline',
            color: 'red',
        },
    };

    useEffect(() => {
        getExtrato();
    }, []);

    async function getExtrato() {
        console.log(accessToken)
        try {
            const response = await axios.get(
                "http://localhost:8000/api/extrato/",
                {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );
            console.log(response)
            setExtratoItems(response.data);
        } catch (error) {
            console.error("Erro ao obter extrato:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.middle}>
                {console.log(extratoItems)}
                {loading ? (
                    <Text style={styles.txt}>Carregando...</Text>
                ) : extratoItems.length === 0 ? (
                    <Text style={styles.txt}>Não tem transações</Text>
                ) : (
                    extratoItems.map((item, index) =>
                        <View key={index}>
                            <Text style={styles.txt}>{item.tipo}</Text>
                            <Text style={styles.txt}>{item.valor}</Text>
                        </View>
                    )
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000040',
        flex: 1
    },
    middle: {
        top: 100
    },
    txt: {
        color: '#fff',
        fontFamily: 'Inter-SemiBold',
        fontSize: 24,
        marginLeft: 15
    },
    txt2: {
        color: '#fff',
        fontFamily: 'Inter-SemiBold',
        fontSize: 15,
        marginTop: 20,
        marginLeft: 15,
        marginBottom: 30
    }
})

