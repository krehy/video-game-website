# Generated by Django 5.0.7 on 2024-08-08 10:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_game_dislike_count_game_like_count'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='main_image',
        ),
        migrations.RemoveField(
            model_name='game',
            name='release_date',
        ),
        migrations.RemoveField(
            model_name='game',
            name='trailer_url',
        ),
    ]
