# Generated by Django 5.0.7 on 2024-08-16 16:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0047_alter_aktualita_text'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productvariant',
            name='color',
        ),
        migrations.RemoveField(
            model_name='productvariant',
            name='size',
        ),
        migrations.RemoveField(
            model_name='product',
            name='categories',
        ),
        migrations.RemoveField(
            model_name='product',
            name='linked_games',
        ),
        migrations.RemoveField(
            model_name='product',
            name='main_image',
        ),
        migrations.RemoveField(
            model_name='product',
            name='page_ptr',
        ),
        migrations.RemoveField(
            model_name='blogpost',
            name='linked_product',
        ),
        migrations.RemoveField(
            model_name='review',
            name='linked_product',
        ),
        migrations.RemoveField(
            model_name='productimage',
            name='product',
        ),
        migrations.RemoveField(
            model_name='productvariant',
            name='product',
        ),
        migrations.RemoveField(
            model_name='productimage',
            name='image',
        ),
        migrations.RemoveField(
            model_name='productvariant',
            name='platform',
        ),
        migrations.DeleteModel(
            name='ClothingColor',
        ),
        migrations.DeleteModel(
            name='ClothingSize',
        ),
        migrations.DeleteModel(
            name='ProductCategory',
        ),
        migrations.DeleteModel(
            name='Product',
        ),
        migrations.DeleteModel(
            name='ProductImage',
        ),
        migrations.DeleteModel(
            name='ProductVariant',
        ),
    ]
