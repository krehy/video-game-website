# Generated by Django 5.0.7 on 2024-08-04 14:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_blogindexpage_keywords_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogindexpage',
            name='meta_description',
        ),
        migrations.RemoveField(
            model_name='blogindexpage',
            name='title_tag',
        ),
        migrations.RemoveField(
            model_name='blogpost',
            name='meta_description',
        ),
        migrations.RemoveField(
            model_name='blogpost',
            name='title_tag',
        ),
        migrations.RemoveField(
            model_name='game',
            name='meta_description',
        ),
        migrations.RemoveField(
            model_name='game',
            name='title_tag',
        ),
        migrations.RemoveField(
            model_name='gameindexpage',
            name='meta_description',
        ),
        migrations.RemoveField(
            model_name='gameindexpage',
            name='title_tag',
        ),
        migrations.RemoveField(
            model_name='product',
            name='meta_description',
        ),
        migrations.RemoveField(
            model_name='product',
            name='title_tag',
        ),
        migrations.RemoveField(
            model_name='productindexpage',
            name='meta_description',
        ),
        migrations.RemoveField(
            model_name='productindexpage',
            name='title_tag',
        ),
        migrations.RemoveField(
            model_name='review',
            name='meta_description',
        ),
        migrations.RemoveField(
            model_name='review',
            name='title_tag',
        ),
        migrations.RemoveField(
            model_name='reviewindexpage',
            name='meta_description',
        ),
        migrations.RemoveField(
            model_name='reviewindexpage',
            name='title_tag',
        ),
    ]