# Generated by Django 5.0.7 on 2024-08-04 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_review_review_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='reviewattribute',
            name='text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
