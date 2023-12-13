import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useAuthStore } from '../../stores/authStore/index';
import axios from "axios";

const Credito = () => {
    const currentDate = new Date().toDateString();
    const [conta, setConta] = useState();
    const [user, setUser] = useState();
    const [hasCard, setHasCard] = useState(false);
    const [cardDetails, setCardDetails] = useState();

    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        getConta();
        getUser();
        checkCardStatus();
    }, []);

    async function getConta() {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/conta/",
                {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );
            const conta = response.data[0].id;
            setConta(conta);
        } catch (error) {
            console.error("Erro ao obter conta:", error);
        }
    }

    async function getUser() {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/conta/",
                {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );
            const user = response.data.id;
            console.log(response.data.id)
            setUser(user);
        } catch (error) {
            console.error("Erro ao obter usuário:", error);
            console.log(response.data)
        }
    }

    async function checkCardStatus() {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/cartao/",
                {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );

            console.log(response?.data);
            if (response.data.length > 0) {
                setHasCard(true);
                setCardDetails(response.data[0]);
            }
        } catch (error) {
            console.error("Erro ao verificar status do cartão:", error);
        }
    }

    async function solicitarCartao() {
        try {
            if (hasCard && cardDetails) {
                console.log("Detalhes do Cartão:", cardDetails);
            } else {
                await axios.post(
                    "http://localhost:8000/api/cartao/",
                    {
                        headers: {
                            Authorization: "Bearer " + accessToken,
                        },
                    },
                    {
                        "numero": "123",
                        "validade": "2023-01-01",
                        "cvv": "123",
                        "situacao": "Ativo",
                        "user": user,
                        "conta": conta,

                    },
                );

                console.log("Cartão solicitado com sucesso!");
            }
        } catch (e) {
            console.log("Erro: " + e);
            alert("Erro");
        }
    }
    return (
        <View style={styles.container}>
        <View style={styles.middle}>
          {hasCard && cardDetails ? (
            <>
              <Text style={styles.txt}>Detalhes do Cartão:</Text>
              <Text style={styles.txt}>Número: {cardDetails.numero}</Text>
              <Text style={styles.txt}>Validade: {cardDetails.validade}</Text>
              <Text style={styles.txt}>CVV: {cardDetails.cvv}</Text>
            </>
          ) : (
            <>
              <Text style={styles.txt}>Informe o cpf novamente</Text>
              <TextInput placeh={"Digite o cpf"} />
              <Text style={styles.txt}>Digite sua data de nascimento</Text>
              <TextInput placeh={"dd-mm-aaaa"} />
              <TouchableOpacity style={styles.fim} onPress={solicitarCartao}>Confirmar</TouchableOpacity>
            </>
          )}
          
        </View>
      </View>
    )
}


const styles = StyleSheet.create({
    container:{
        backgroundColor:'#000040',
        flex: 1
    },
    middle:{
        top:100
    },
    txt:{
        color:'#fff',
        fontFamily: 'Inter-SemiBold',
        fontSize:24,
        marginLeft:15,
        paddingTop:10
    },
    txt2:{
        color:'#fff',
        fontFamily: 'Inter-SemiBold',
        fontSize:15,
        marginTop:20,
        marginLeft:15,
        marginBottom:30
    },
    fim: {
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
});

export default Credito