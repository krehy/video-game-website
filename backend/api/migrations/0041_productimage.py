# Generated by Django 5.0.7 on 2024-08-13 10:09

import django.db.models.deletion
import modelcluster.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0040_alter_product_price'),
        ('wagtailimages', '0026_delete_uploadedimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='wagtailimages.image')),
                ('product', modelcluster.fields.ParentalKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.product')),
            ],
        ),
    ]