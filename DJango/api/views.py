from .models import User, Conta
from .serializer import ClienteSerializer, SerializerConta, SerializerCartao
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView
from rest_framework.decorators import action
from rest_framework_simplejwt import authentication as authenticationJWT
from api.models import Conta, Cartao, Transacao, Emprestimo
from rest_framework import (viewsets, status)
from api import serializer
from django.db.models import Q
import decimal, random
from rest_framework.generics import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt import authentication as authenticationJWT


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
        serializers = serializer.TransacaoSerializer(data=request.data)
        auth_user = request.user

        if serializers.is_valid():
            print('cheguei')
            conta_destino_id = serializers.validated_data.get('conta_destino')
            valor = serializers.validated_data.get('valor')
            descricao = serializers.validated_data.get('descricao')

            conta_origem = Conta.objects.filter(cliente=auth_user).first()
            print("Conta origem: ", conta_origem)
            conta_destino = Conta.objects.filter(id=conta_destino_id).first()
            print("Conta destino: ", conta_destino)
            if conta_origem and conta_destino:
                if conta_origem.saldo >= valor:
                    transacao = Transacao.objects.create(
                        conta_destino=conta_destino,
                        conta_origem=conta_origem,
                        valor=valor,
                        descricao=descricao
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
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        
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
                    return Response({"message": f"Solicitação de empréstimo {emprestimo_status.lower()} realizada com sucesso"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Solicitação de empréstimo negada"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Conta não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "O 'conta_id' e 'valor_emprestimo' são obrigatórios"}, status=status.HTTP_400_BAD_REQUEST)