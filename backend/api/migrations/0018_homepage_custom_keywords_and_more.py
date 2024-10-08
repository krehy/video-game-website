# Generated by Django 5.0.7 on 2024-08-05 18:22

import modelcluster.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_review_review_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='homepage',
            name='custom_keywords',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='homepage',
            name='custom_search_description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='categories',
            field=modelcluster.fields.ParentalManyToManyField(blank=True, to='api.articlecategory'),
        ),
        migrations.AlterField(
            model_name='game',
            name='genres',
            field=modelcluster.fields.ParentalManyToManyField(blank=True, to='api.genre'),
        ),
        migrations.AlterField(
            model_name='game',
            name='platforms',
            field=modelcluster.fields.ParentalManyToManyField(blank=True, to='api.platform'),
        ),
        migrations.AlterField(
            model_name='product',
            name='categories',
            field=modelcluster.fields.ParentalManyToManyField(blank=True, to='api.productcategory'),
        ),
        migrations.AlterField(
            model_name='product',
            name='linked_games',
            field=modelcluster.fields.ParentalManyToManyField(blank=True, to='api.game'),
        ),
        migrations.AlterField(
            model_name='review',
            name='categories',
            field=modelcluster.fields.ParentalManyToManyField(blank=True, to='api.articlecategory'),
        ),
    ]
