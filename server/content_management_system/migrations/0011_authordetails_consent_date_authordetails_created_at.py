from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content_management_system', '0010_contactdetails_created_at_contactdetails_created_by_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='authordetails',
            name='consent_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='authordetails',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
