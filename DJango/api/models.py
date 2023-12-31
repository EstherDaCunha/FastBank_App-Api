from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import random
from datetime import date, timedelta
from django.utils import timezone
import uuid
import os
from datetime import datetime


def user_image_field(instance, filename):
    ext = os.path.splitext(filename)[1]
    filename = f'{uuid.uuid4()}{ext}'
    
    return os.path.join('uploads', 'user', filename)


class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    dataNasc = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    url_imagem = models.ImageField(null=True, upload_to=user_image_field)
    last_try_login = models.DateTimeField(default=datetime.now)
    count_try_login = models.IntegerField(default=0)

    username = None
    first_name = None
    last_name = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

class Conta (models.Model): 
    cliente = models.ForeignKey(User, on_delete=models.CASCADE)
    agencia = models.CharField(max_length=4)
    conta = models.CharField(max_length=9)
    saldo = models.DecimalField(max_digits=12, decimal_places=2)

class Cartao(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conta = models.ForeignKey(Conta, on_delete=models.CASCADE)
    numero = models.CharField(max_length = 22)
    validade = models.DateField()
    cvv = models.CharField(max_length = 5)
    situacao = models.CharField(max_length = 50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        self.cvv = f"{random.randint(100,999)}"
        self.validade = date.today() + timedelta(1825)
        self.numero = f"{random.randint(1000,9999)} {random.randint(1000,9999)} {random.randint(1000,9999)} {random.randint(1000,9999)}"

        super(Cartao, self).save(*args, **kwargs)
        
    def __str__(self) -> str:
        return self.numero
    
class Transacao(models.Model):
    conta_destino = models.ForeignKey(Conta, on_delete=models.DO_NOTHING, related_name="conta_destino", null=True)
    conta_origem = models.ForeignKey(Conta, on_delete=models.DO_NOTHING, related_name="conta_origem", null=True)
    valor = models.DecimalField(max_digits=20, decimal_places=2)
    descricao = models.CharField(max_length=150, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    cartao = models.ForeignKey(Cartao, on_delete=models.DO_NOTHING, related_name="cartao", null=True)

class Emprestimo(models.Model):
    conta = models.ForeignKey(Conta, related_name="fk_conta", on_delete=models.PROTECT)
    valor_emprest = models.DecimalField(decimal_places=2, max_digits=10)
    parcelas = models.IntegerField()
    valor_parcelas = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='Pendente')
    dataVenc = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.dataVenc:
            self.dataVenc = timezone.now() + timedelta(3650)
        super(Emprestimo, self).save(*args, **kwargs)
        
    def __str__(self):
        return f'Empréstimo de {self.valor_emprest} para {self.conta}'
    
class Extrato(models.Model):
    conta = models.ForeignKey(
        Conta,
        related_name='extrato',
        on_delete=models.DO_NOTHING
    )
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)


