from django.urls import path
from . import views

urlpatterns = [
    path('clientes/', views.listar_clientes),
    path('usuarios/', views.ClientesView.as_view()),

    path('conta/', views.ContaListCreate.as_view()),
    path('conta/<int:pk>', views.ContaDetailView.as_view()),
]
