from rest_framework import serializers
from api.models import User, Conta, Cartao, Transacao

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

class DepositoSerializer(serializers.Serializer):
    value = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    class Meta:
        fields = ['value']

class SerializerCartao(serializers.ModelSerializer):
    class Meta: 
        model = Cartao
        fields = '__all__'

class TransacaoSerializer(serializers.ModelSerializer):
    conta_destino = SerializerConta(many=False, read_only=True)
    conta_origem = serializers.IntegerField()
    class Meta:
        model = Transacao
        fields = '__all__' 