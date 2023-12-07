from .models import User, Conta
from .serializer import ClienteSerializer, SerializerConta, SerializerCartao, ExtratoSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView
from rest_framework.decorators import action
from rest_framework_simplejwt import authentication as authenticationJWT
from api.models import Conta, Cartao, Transacao, Emprestimo, Extrato
from rest_framework import (viewsets, status)
from api import serializer
from django.db.models import Q
import decimal, random
from rest_framework.generics import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt import authentication as authenticationJWT
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import datetime, timedelta
from rest_framework_simplejwt import authentication as authenticationJWT
from rest_framework_simplejwt.tokens import AccessToken 
from django.contrib.auth import authenticate




@api_view(['GET', 'POST'])
def listar_clientes(request):
    if request.method == 'GET':
        queryset = User.objects.all()
        serializer = ClienteSerializer(queryset, many=True)
        return Response(serializer.data)

class ClientesView(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = ClienteSerializer 
  

class ClentesDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = ClienteSerializer

class ContaViewSet(viewsets.ModelViewSet):    
    permission_classes = (IsAuthenticated,)
    serializer_class = SerializerConta
    authentication_classes = [authenticationJWT.JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        contas = Conta.objects.filter(cliente=user)
        return contas
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return serializer.ContaDetailSerializer
        
        return serializer.SerializerConta
    def create(self, request, *args, **kwargs):
        serializer = SerializerConta(data=request.data)
        if serializer.is_valid():
            agencia = '0001'
            numero = ''.join([str(random.randint(0, 9)) for _ in range(8)])
            conta = Conta(
                cliente=self.request.user,
                conta=numero,
                agencia=agencia,
                saldo=0
            )
            conta.save()
            return Response({'message': 'Conta criada com sucesso'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(methods=['POST'], detail=False, url_path='depositar')
    def depositar(self, request):
        user = self.request.user
        conta = Conta.objects.filter(cliente=user).first()
        serializer_recebido = serializer.DepositoSerializer(data=request.data)

        if serializer_recebido.is_valid() and conta:
            valor_deposito = decimal.Decimal(serializer_recebido.validated_data.get('value'))
            saldo = decimal.Decimal(conta.saldo)

            conta.saldo = saldo + valor_deposito
            conta.save()

            extrato = Extrato.objects.create(
                conta=conta,
                valor=valor_deposito,
                tipo="Deposito"
            )

            extrato.save()

            return Response({"saldo": conta.saldo}, status=status.HTTP_200_OK)

        return Response(serializer_recebido.errors, status=status.HTTP_400_BAD_REQUEST)

    
class CartaoViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Cartao.objects.all()
    serializer_class = serializer.SerializerCartao
    authentication_classes = [authenticationJWT.JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Pegar contas para usuários autenticados"""
        queryset = self.queryset
        return queryset.filter(conta=(Conta.objects.all().filter(user=self.request.user).order_by("created_at").first())).order_by("created_at").distinct()
    

    @action(detail=False, methods=["POST"], url_path='solicitar')
    def solicitar_cartao(self, request):
        auth_user = request.user

        if auth_user:
            conta = Conta.objects.filter(cliente=auth_user).first()

            if conta:
                cartao_solicitado = Cartao.objects.filter

        
class TransacaoViewSet(viewsets.ViewSet):
    queryset = Transacao.objects.all()
    serializer_class = serializer.TransacaoSerializer
    authentication_classes = [authenticationJWT.JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def listar_transacoes(self, request):
        auth_user = request.user

        if auth_user:
            conta = Conta.objects.filter(user=auth_user).first()

            if conta:
                transacoes_conta = Transacao.objects.filter(Q(conta_origem=conta) | Q(conta_destino=conta))
                serializer = serializer.TransacaoSerializer(transacoes_conta, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Conta não encontrada para o usuário logado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Usuário não autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
        
        
    @action(detail=False, methods=['post'])
    def transferencia(self, request):
        serializer_ = serializer.TransacaoSerializer(data=request.data)
        auth_user = request.user

        if serializer_.is_valid():
            conta_destino_id = serializer_.validated_data.get('conta_destino')
            valor = serializer_.validated_data.get('valor')
            descricao = serializer_.validated_data.get('descricao')
            cartao_id = serializer_.validated_data.get('cartao')

            conta_origem = Conta.objects.filter(cliente=auth_user).first()

            if not conta_origem:
                return Response({"message": "Conta de origem não encontrada"}, status=status.HTTP_404_NOT_FOUND)

            try:
                conta_destino = Conta.objects.get(id=conta_destino_id)
            except Conta.DoesNotExist:
                print(f"Conta de destino não encontrada. ID: {conta_destino_id}")
                return Response({"message": "Conta de destino não encontrada"}, status=status.HTTP_404_NOT_FOUND)

            try:
                cartao = Cartao.objects.get(id=cartao_id)
            except Cartao.DoesNotExist:
                print(f"Cartão não encontrado. ID: {cartao_id}")
                return Response({"message": "Cartão não encontrado"}, status=status.HTTP_404_NOT_FOUND)

            if conta_origem.saldo >= valor:
                transacao = Transacao.objects.create(
                    conta_destino=conta_destino,
                    conta_origem=conta_origem,
                    valor=valor,
                    descricao=descricao,
                    cartao=cartao  # Agora estamos passando o objeto Cartao
                )

                conta_origem.saldo -= valor
                conta_destino.saldo += valor

                conta_origem.save()
                conta_destino.save()

                extrato = Extrato.objects.create(
                conta=conta_origem,
                valor=valor,
                tipo="Transferencia"
                )

                extrato.save()

                return Response({"message": "Transação realizada com sucesso"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Saldo insuficiente na conta de origem"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("Erros do serializer:", serializer_.errors)
            return Response(serializer_.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['GET'])
    def criar_extrato(self, request):
        auth_user = request.user

        if auth_user:
            conta = Conta.objects.filter(cliente=auth_user).first()

            if conta:
                transacoes_conta = Transacao.objects.filter(Q(conta_origem=conta) | Q(conta_destino=conta)).order_by('valor')
                extrato = []

                saldo_atual = conta.saldo

                for transacao in transacoes_conta:
                    extrato.append({
                        'created_at': transacao.created_at,
                        'valor': transacao.valor,
                        'descricao': transacao.descricao,
                        'saldo_atual': saldo_atual
                    })

                    if transacao.conta_origem.id == conta.id:
                        saldo_atual -= transacao.valor
                    elif transacao.conta_destino.id == conta.id:
                        saldo_atual += transacao.valor

                return Response(extrato, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Conta não encontrada para o usuário logado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Usuário não autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

class EmprestimoViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    authentication_classes = [authenticationJWT.JWTAuthentication]
    queryset = Emprestimo.objects.all()
    serializer_class = serializer.EmprestimoSerializer

    @action(detail=False, methods=['GET'])
    def listar_emprestimos(self, request):
        conta = Conta.objects.filter(user=request.user).first()
        emprestimo = Emprestimo.objects.filter(conta=conta)
        serializer = self.get_serializer(emprestimo, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['POST'])
    def solicitar_emprestimo(self, request):
        conta_id = request.data.get('conta')
        valor_emprestimo = decimal.Decimal(request.data.get('valor_emprest'))
        print(valor_emprestimo)
        if conta_id and valor_emprestimo:
            conta = Conta.objects.filter(id=conta_id).first()

            if conta:
                emprestimo_status = 'Negado'


                if conta.saldo >= (5 * valor_emprestimo):
                    emprestimo_status = 'Aprovado'
                    # Transferir o valor do empréstimo para a conta
                    conta.saldo += valor_emprestimo
                    conta.save()

                emprestimo = Emprestimo.objects.create(
                    conta=conta,
                    valor_emprest=valor_emprestimo,
                    parcelas = 0 if emprestimo_status == 'Negado' else request.data.get('parcelas', 18),
                    valor_parcelas= 0 if emprestimo_status == "Negado" else valor_emprestimo / 18,
                    status=emprestimo_status
                )


                if emprestimo_status == 'Aprovado':
                    extrato = Extrato.objects.create(
                    conta=conta,
                    valor=valor_emprestimo,
                    tipo="Emprestimo Aprovado"
                    )

                    extrato.save()
                    return Response({"message": f"Solicitação de empréstimo {emprestimo_status.lower()} realizada com sucesso"}, status=status.HTTP_201_CREATED)
                else:
                    extrato = Extrato.objects.create(
                    conta=conta,
                    valor=valor_emprestimo,
                    tipo="Emprestimo negado"
                    )

                    extrato.save()
                    return Response({"message": "Solicitação de empréstimo negada"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Conta não encontrada"}, status=status.HTTP_404_NOT_FOUND)
            
        else:
            return Response({"message": "O 'conta_id' e 'valor_emprestimo' são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)
        
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {"error": "Email ou senha incorretos"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.filter(email=email).first()

        formato_data = '%Y-%m-%d %H:%M:%S'
        converter = datetime.strftime(datetime.now(), formato_data)

        if user is None:
            return Response(
                {"detail": "Conta não encontrada"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        ultima_tentativa = datetime.strftime(
            user.last_try_login, formato_data)
        diferenca = (datetime.strptime(converter, formato_data) -
                      datetime.strptime(ultima_tentativa, formato_data))
        
        if user.count_try_login == 2:
            if timedelta(minutes=1) - diferenca <= timedelta(seconds=0):
                user.count_try_login = 0
                user.save()
            else:
                    return Response(
                        {"detail": f"Tente novamente {timedelta(minutes=1) - diferenca} minutos depois"},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            
        autenticar = authenticate(request, username=email, password=password)

        if autenticar is None:
            if diferenca < timedelta(minutes=1) and user.count_try_login < 2:
                user.count_try_login += 1
            else:
                user.count_try_login = 0

            user.last_try_login = datetime.now()

            user.save()
            return Response(
                {"detail": "Conta não encontrada"}
            )
        user.save()

        access = AccessToken.for_user(user)
        token_data = {
            "access": str(access),
        }
        return Response(token_data, status=status.HTTP_200_OK)
    
class ExtratoViewSet(viewsets.ModelViewSet):
    queryset = Extrato.objects.all()
    serializer_class = serializer.ExtratoSerializer
    authentication_classes = [authenticationJWT.JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        conta = Conta.objects.filter(cliente=self.request.user).first()
        queryset = self.queryset

        return queryset.filter(
            conta=conta
        ).order_by('id').distinct()
    


        