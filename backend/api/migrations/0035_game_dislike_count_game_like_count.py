# Generated by Django 5.0.7 on 2024-08-08 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_remove_game_dislike_count_remove_game_like_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='dislike_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='game',
            name='like_count',
            field=models.IntegerField(default=0),
        ),
    ]
