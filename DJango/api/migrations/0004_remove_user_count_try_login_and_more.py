# Generated by Django 4.2.6 on 2023-12-01 19:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_user_count_try_login_user_last_try_login'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='count_try_login',
        ),
        migrations.RemoveField(
            model_name='user',
            name='last_try_login',
        ),
    ]
