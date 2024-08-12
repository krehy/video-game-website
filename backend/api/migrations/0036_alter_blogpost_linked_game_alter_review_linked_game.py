# Generated by Django 5.0.7 on 2024-08-08 10:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_game_dislike_count_game_like_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogpost',
            name='linked_game',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='linked_blog_posts', to='api.game'),
        ),
        migrations.AlterField(
            model_name='review',
            name='linked_game',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='linked_reviews', to='api.game'),
        ),
    ]
