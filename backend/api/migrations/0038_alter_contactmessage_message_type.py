# Generated by Django 5.0.7 on 2024-08-12 20:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0037_contactmessage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactmessage',
            name='message_type',
            field=models.CharField(choices=[('cooperation', 'Spolupráce'), ('problem', 'Nahlásit problém'), ('inquiry', 'Jiný dotaz')], max_length=20),
        ),
    ]