from rest_framework import serializers
from api.models import User, Conta, Cartao, Transacao, Emprestimo, Extrato

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'dataNasc', 'email', 'password','url_imagem']
    
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
        fields = ['id', 'agencia', 'conta', 'saldo']
        read_only_fields = ['conta']

class ContaDetailSerializer(SerializerConta):
    class Meta(SerializerConta.Meta):
        fields = SerializerConta.Meta.fields + ['id', 'saldo']

class DepositoSerializer(serializers.Serializer):
    value = serializers.DecimalField(max_digits=15, decimal_places=2)
    
    class Meta:
        fields = ['value']

class SerializerCartao(serializers.ModelSerializer):
    class Meta: 
        model = Cartao
        fields = '__all__'

class TransacaoSerializer(serializers.ModelSerializer):
    conta_destino = serializers.IntegerField()
    conta_origem = serializers.IntegerField()
    cartao = serializers.IntegerField() 
    class Meta:
        model = Transacao
        fields = '__all__' 

class EmprestimoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emprestimo
        fields = '__all__'

class ExtratoSerializer(serializers.ModelSerializer):
    conta = SerializerConta(read_only=True, many=False)
    class Meta:
        model = Extrato
        fields = '__all__'
