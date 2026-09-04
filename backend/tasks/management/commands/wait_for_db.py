import time

from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError


class Command(BaseCommand):
    help = 'Wait until PostgreSQL accepts connections'

    def handle(self, *args, **options):
        self.stdout.write('Waiting for database...')
        while True:
            try:
                connections['default'].ensure_connection()
                break
            except OperationalError:
                time.sleep(1)
        self.stdout.write(self.style.SUCCESS('Database is ready.'))
