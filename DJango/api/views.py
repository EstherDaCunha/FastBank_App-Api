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

class ContaListCreate(ListCreateAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = Conta.objects.all()
    serializer_class = SerializerConta
    authentication_classes = [authenticationJWT.JWTAuthentication]

    def get_queryset(self):
        queryset = Conta.objects.all()
        id_res = self.request.query_params.get("cliente_id")
        if id_res is not None:
            queryset = queryset.filter(cliente_id=id_res)
            return queryset        
        return super().get_queryset()
    
    @action(methods=['POST'], detail=True, url_path='depositar')
    def depositar(self, request, pk=None):
        conta = Conta.objects.filter(id=pk).first()
        serializer_recebido = serializer.DepositoSerializer(data=request.data)
        
        if serializer_recebido.is_valid() and conta:
            
            valor_deposito = decimal.Decimal(serializer_recebido.validated_data.get('value'))
            saldo = decimal.Decimal(conta.saldo)
            
            conta.saldo = saldo + valor_deposito
            conta.save()
            return Response({"saldo": conta.saldo}, status=status.HTTP_200_OK)
            
        return Response(serializer_recebido.errors, status=status.HTTP_400_BAD_REQUEST)

class ContaDetailView(RetrieveUpdateDestroyAPIView):    
    permission_classes = (IsAuthenticated)
    queryset = Conta.objects.all()
    serializer_class = SerializerConta
    authentication_classes = [authenticationJWT.JWTAuthentication]

class CartaoViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    authentication_classes = [authenticationJWT.JWTAuthentication]
    queryset = Cartao.objects.all()
    serializer_class = serializer.SerializerCartao

    def get_queryset(self):
        queryset = self.queryset
        conta = Conta.objects.filter(user=self.request.user).order_by("created_at").first()
        return queryset.filter(conta=conta).order_by("created_at").distinct()

    def create(self, request, *args, **kwargs):
        conta = Conta.objects.filter(user=request.user).order_by("created_at").first()

        if not conta:
            return Response({"message": "Usuário não tem uma conta associada."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = serializer.SerializerCartao(data=request.data)
        
        if serializer.is_valid():
            
            serializer.validated_data["conta"] = conta

            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class TransacaoViewSet(viewsets.ViewSet):
    queryset = Transacao.objects.all()
    serializer_class = serializer.TransacaoSerializer
    permission_classes = [IsAuthenticated]

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
                        cartao_id=cartao.id  # Substitua pelo campo correto do seu modelo
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