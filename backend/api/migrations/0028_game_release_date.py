# Generated by Django 5.0.7 on 2024-08-08 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_game_main_image_game_trailer_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='release_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]