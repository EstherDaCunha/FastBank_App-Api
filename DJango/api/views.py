from .models import User, Conta
from .serializer import ClienteSerializer, SerializerConta, SerializerCartao
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import action
from rest_framework_simplejwt import authentication as authenticationJWT
from api.models import Conta, Cartao, Transacao
from rest_framework import (viewsets, status)
from api import serializer
from django.db.models import Q
import decimal, random

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
    queryset = Conta.objects.all()
    serializer_class = SerializerConta
    authentication_classes = [authenticationJWT.JWTAuthentication]

    
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


    @action(methods=['POST'], detail=True, url_path='depositar')
    def depositar(self, request, pk=None):
        conta = Conta.objects.filter(id=pk).first()
        serializer_recebido = serializer.DepositoSerializer(data=request.data)
        
        if conta and serializer_recebido.is_valid():
            valor_deposito = decimal.Decimal(serializer_recebido.validated_data.get('value'))
            saldo = decimal.Decimal(conta.saldo)
            
            conta.saldo = saldo + valor_deposito
            conta.save()
            return Response({"saldo": conta.saldo}, status=status.HTTP_200_OK)
        
        return Response({"message": "Conta não encontrada ou dados inválidos"}, status=status.HTTP_400_BAD_REQUEST)

    
class CartaoViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    authentication_classes = [authenticationJWT.JWTAuthentication]
    queryset = Cartao.objects.all()
    serializer_class = serializer.SerializerCartao

    def get_queryset(self):
        queryset = self.queryset
        cliente = self.request.cliente if hasattr(self.request, 'cliente') else None

        if cliente:
            return queryset.filter(conta__cliente=cliente).order_by("created_at").distinct()
        else:
            return Cartao.objects.none()

    def create(self, request, *args, **kwargs):
        cliente = getattr(request, 'cliente', None)

        if not cliente:
            return Response({"message": "Usuário não tem uma conta associada."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = serializer.SerializerCartao(data=request.data)
        
        if serializer.is_valid():
            serializer.validated_data["conta"] = cliente.conta
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
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
        serializer = serializer.TransacaoSerializer(data=request.data)
        auth_user = request.user

        if serializer.is_valid():
            conta_destino_id = serializer.validated_data.get('conta_origem')
            valor = serializer.validated_data.get('valor')
            descricao = serializer.validated_data.get('descricao')
            cartao = serializer.validated_data.get('cartao')

            conta_origem = Conta.objects.filter(user=auth_user).first()
            print("Conta origem: ", conta_origem)
            conta_destino = Conta.objects.filter(id=conta_destino_id).first()
            print("Conta destino: ", conta_destino)
            if conta_origem and conta_destino:
                if conta_origem.saldo >= valor:
                    transacao = Transacao.objects.create(
                        conta_destino=conta_destino,
                        conta_origem=conta_origem,
                        valor=valor,
                        descricao=descricao,
                        cartao_id=cartao.id 
                    )

                    conta_origem.saldo -= valor
                    conta_destino.saldo += valor

                    conta_origem.save()
                    conta_destino.save()

                    return Response({"message": "Transação realizada com sucesso"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Saldo insuficiente na conta de origem"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "Conta de origem ou destino não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)