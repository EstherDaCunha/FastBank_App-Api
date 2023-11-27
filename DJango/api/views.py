from django.shortcuts import render
from .models import User, Conta
from .serializer import ClienteSerializer, SerializerConta
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

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
        serializer_recebido = serializers.DepositoSerializer(data=request.data)
        
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