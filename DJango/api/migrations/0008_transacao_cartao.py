# Generated by Django 4.2.6 on 2023-12-05 18:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_transacao_cartao'),
    ]

    operations = [
        migrations.AddField(
            model_name='transacao',
            name='cartao',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='cartao', to='api.cartao'),
        ),
    ]
