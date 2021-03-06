# Generated by Django 3.2.8 on 2022-01-10 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('FutureEagles', '0002_auto_20220110_0847'),
    ]

    operations = [
        migrations.CreateModel(
            name='Google_user',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_profile', models.CharField(max_length=99)),
                ('user_id', models.CharField(max_length=90)),
                ('user_image', models.CharField(max_length=999)),
                ('user_email', models.CharField(max_length=99)),
            ],
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=20)),
                ('task', models.CharField(max_length=999)),
                ('due_date', models.CharField(max_length=11)),
                ('status', models.CharField(max_length=10)),
            ],
        ),
    ]
