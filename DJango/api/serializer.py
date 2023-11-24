from rest_framework import serializers
from .models import User, Conta

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'dataNasc', 'email', 'password']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)
        
        if password is not None:
            user.set_password(password)

        user.save()
        return user

class SerializerConta(serializers.ModelSerializer):
    class Meta: 
        model = Conta
       	fields = ['id', 'cliente', 'agencia', 'conta', 'saldo']