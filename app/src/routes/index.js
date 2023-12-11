
import { createStackNavigator } from '@react-navigation/stack'
import Welcome from '../pages/Welcome'
import SignIn from '../pages/SignIn'
import Inicial from '../pages/Inicial'
import Pix from '../pages/Pix/Pix'
import PixCpf from '../pages/Pix/PixCpf'
import PixCelular from '../pages/Pix/PixCelular'
import PixCodigo from '../pages/Pix/PixCodigo'
import PixCnpj from '../pages/Pix/PixCnpj'
import PixChave from '../pages/Pix/PixChave'
import CodigoBarra from '../pages/CodigoBarra/CodigoBarra'
import Transf from '../pages/Transferencia/Transf'
import Deposito from '../pages/Deposito/Deposito'
import Confirmacao from '../pages/Deposito/Confirmacao'
import Emprestimo from '../pages/Emprestimo/Emprestimo'
import Cadastro from '../pages/Cadastro/Cadastro'
import ConfirmacaoEmp from '../pages/Emprestimo/ConfirmacaoEmp'
import Credito from '../pages/Credito/Credito'

const Stack = createStackNavigator()

export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Inicial"
                component={Inicial}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Pix"
                component={Pix}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="PixCpf"
                component={PixCpf}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="PixCelular"
                component={PixCelular}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="PixCodigo"
                component={PixCodigo}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="PixCnpj"
                component={PixCnpj}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="PixChave"
                component={PixChave}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="CodigoBarra"
                component={CodigoBarra}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Transf"
                component={Transf}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Deposito"
                component={Deposito}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Confirmacao"
                component={Confirmacao}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Emprestimo"
                component={Emprestimo}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Cadastro"
                component={Cadastro}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ConfirmacaoEmp"
                component={ConfirmacaoEmp}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Credito"
                component={Credito}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>

    )
}