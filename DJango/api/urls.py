from django.urls import path
from . import views
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('clientes/', views.listar_clientes),
    path('usuarios/', views.ClientesView.as_view()),

    path('conta/', views.ContaListCreate.as_view()),
    path('conta/<int:pk>', views.ContaDetailView.as_view()),

    path('cartao/', views.CartaoViewSet.as_view({'get': 'list'})),
    path('transacao/', views.TransacaoViewSet.as_view({'get': 'list'})),
]

