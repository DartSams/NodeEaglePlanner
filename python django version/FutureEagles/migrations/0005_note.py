# Generated by Django 3.2.8 on 2022-01-13 23:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FutureEagles', '0004_auto_20220110_1525'),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=20)),
                ('user_id', models.CharField(max_length=99)),
                ('note_message', models.TextField()),
            ],
        ),
    ]
