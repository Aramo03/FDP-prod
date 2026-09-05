from django.test import TestCase
from .models import Task


class TaskTestCase(TestCase):
    def test_create_task(self):
        task = Task.objects.create(
            title="Test task",
            description="Testing CI",
        )

        self.assertEqual(task.title, "Test task")
        self.assertFalse(task.completed)      
