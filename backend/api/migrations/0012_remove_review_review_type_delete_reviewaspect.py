# Generated by Django 5.0.7 on 2024-08-04 18:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_review_categories_review_review_type_reviewaspect'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='review',
            name='review_type',
        ),
        migrations.DeleteModel(
            name='ReviewAspect',
        ),
    ]
