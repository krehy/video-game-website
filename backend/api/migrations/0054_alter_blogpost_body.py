# Generated by Django 5.1.4 on 2025-01-13 21:44

import wagtail.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0053_alter_blogpost_options_alter_blogpost_body'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogpost',
            name='body',
            field=wagtail.fields.StreamField([('paragraph', 0), ('advertisement', 1)], block_lookup={0: ('wagtail.blocks.RichTextBlock', (), {'required': True}), 1: ('wagtail.blocks.StructBlock', [[]], {})}, default=''),
        ),
    ]
