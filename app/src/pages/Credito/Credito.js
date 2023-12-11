import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";

const Credito = () => {
    return (
        <div style={styles.container}>
            <Text style={styles.title}>CPF</Text>
            <TextInput
                placeholder=" Digite o cpf"
                style={styles.input}
            />

            <Text style={styles.title}>Data de nascimento</Text>
            <TextInput
                placeholder="Data de nascimento"
                style={styles.input}
            />

            <TouchableOpacity style={styles.prop} onPress={() => navigation.navigate('Inicial')}>
                <Text style={styles.txtTitle}>Confirmar</Text>
            </TouchableOpacity>
        </div>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000040',
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

export default Credito