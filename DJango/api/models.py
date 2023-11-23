from django.db import models
from django.contrib.auth.models import AbstractUser

# class User(AbstractUser):
    # nome = models.CharField(max_length=255)
    # dataNasc = models.CharField(max_length=255)
    # email = models.EmailField(max_length=255, unique=True, null=False)
    # password = models.CharField(max_length=50)

    # username = None
    # first_name = None
    # last_name = None

    # USERNAME_FIELD = "cpf"
    # REQUIRED_FIELDS = []

class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    dataNasc = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    
    username = None
    first_name = None
    last_name = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
