from django.shortcuts import render
from .models import Cliente
from .serializer import ClienteSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView


@api_view(['GET', 'POST'])
def listar_clientes(request):
    if request.method == 'GET':
        queryset = Cliente.objects.all()
        serializer = ClienteSerializer(queryset, many=True)
        return Response(serializer.data)
    
class ClientesView(ListCreateAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class ClentesDetailView(RetrieveAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer