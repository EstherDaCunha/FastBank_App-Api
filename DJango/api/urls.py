from django.urls import path
from . import views
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('clientes/', views.listar_clientes),
    path('usuarios/', views.ClientesView.as_view()),

    path('conta/', views.ContaViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('conta/<int:pk>/depositar', views.ContaViewSet.as_view({'post': 'depositar'})),

    path('cartao/', views.CartaoViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('transacao/', views.TransacaoViewSet.as_view({'get': 'list'})),
    path('emprestimo/', views.EmprestimoViewSet.as_view({'get': 'list'})),
]

