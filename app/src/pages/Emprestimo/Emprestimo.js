import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

export default function Emprestimo() {
    const navigation = useNavigation();

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

                    <Text style={styles.title}>Valor a emprestar</Text>
                    <TextInput 
                    placeholder=" R$ 0,00"
                    style={styles.input}
                    />

                    <Text style={styles.title}>Parcelas</Text>
                    <TextInput 
                    placeholder="Numero de parcelas"
                    style={styles.input}
                    />

                    <Text style={styles.title}>Data</Text>
                    <TextInput 
                    placeholder="Primeiro pagamento"
                    style={styles.input}
                    />

                    <Text style={styles.title}>         Juros 4,5% ao mês</Text>


                <TouchableOpacity style={styles.prop} onPress={() => navigation.navigate('Inicial')}>
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