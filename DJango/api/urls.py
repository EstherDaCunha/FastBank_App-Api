from django.urls import path
from . import views

urlpatterns = [
    path('clientes/', views.listar_clientes),
    path('usuarios/', views.ClientesView.as_view()),

    path('conta/', views.ContaViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('conta/depositar', views.ContaViewSet.as_view({'post': 'depositar'})),

    path('cartao/', views.CartaoViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('transacao/', views.TransacaoViewSet.as_view({'post': 'transferencia', 'get':'criar_extrato'})),
    path('emprestimo/', views.EmprestimoViewSet.as_view({'post': 'solicitar_emprestimo', 'get':'list'})),
]

