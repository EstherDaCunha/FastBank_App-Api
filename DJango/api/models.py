from django.db import models

class Cliente(models.Model):
    nome = models.CharField(max_length=255)
    dataNasc = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    senha = models.CharField(max_length=50)
