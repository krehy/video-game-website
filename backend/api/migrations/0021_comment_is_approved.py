# Generated by Django 5.0.7 on 2024-08-06 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_alter_homepage_options_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]
