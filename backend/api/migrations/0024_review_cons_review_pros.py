# Generated by Django 5.0.7 on 2024-08-07 15:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_game_dislike_count_game_like_count_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='cons',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='review',
            name='pros',
            field=models.TextField(blank=True, null=True),
        ),
    ]