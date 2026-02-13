from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class UserModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team', description='Test Description')
        self.user = User.objects.create(
            name='Test User',
            email='test@example.com',
            password='testpass123',
            team_id=str(self.team.id)
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Test User')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(str(self.user), 'Test User')

    def test_user_email_unique(self):
        with self.assertRaises(Exception):
            User.objects.create(
                name='Duplicate User',
                email='test@example.com',
                password='testpass456',
                team_id=str(self.team.id)
            )


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team', description='Test Description')

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(self.team.description, 'Test Description')
        self.assertEqual(str(self.team), 'Test Team')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id='1',
            activity_type='Running',
            duration=30,
            calories_burned=250,
            date=datetime.now(),
            notes='Morning run'
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.activity_type, 'Running')
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories_burned, 250)


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.leaderboard = Leaderboard.objects.create(
            user_id='1',
            team_id='1',
            total_calories=1000,
            total_activities=10,
            rank=1
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.leaderboard.total_calories, 1000)
        self.assertEqual(self.leaderboard.total_activities, 10)
        self.assertEqual(self.leaderboard.rank, 1)


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Morning Cardio',
            description='High-intensity cardio workout',
            difficulty='Medium',
            duration=45,
            calories_estimate=400,
            category='Cardio'
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Morning Cardio')
        self.assertEqual(self.workout.difficulty, 'Medium')
        self.assertEqual(self.workout.duration, 45)
        self.assertEqual(str(self.workout), 'Morning Cardio')


class UserAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team', description='Test Description')
        self.user_data = {
            'name': 'API Test User',
            'email': 'apitest@example.com',
            'password': 'apipass123',
            'team_id': str(self.team.id)
        }

    def test_create_user(self):
        response = self.client.post('/users/', self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().name, 'API Test User')

    def test_get_users(self):
        User.objects.create(**self.user_data)
        response = self.client.get('/users/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team_data = {
            'name': 'API Test Team',
            'description': 'API Test Description'
        }

    def test_create_team(self):
        response = self.client.post('/teams/', self.team_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)

    def test_get_teams(self):
        Team.objects.create(**self.team_data)
        response = self.client.get('/teams/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.activity_data = {
            'user_id': '1',
            'activity_type': 'Running',
            'duration': 30,
            'calories_burned': 250,
            'date': datetime.now().isoformat(),
            'notes': 'Test activity'
        }

    def test_create_activity(self):
        response = self.client.post('/activities/', self.activity_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_activities(self):
        Activity.objects.create(
            user_id='1',
            activity_type='Running',
            duration=30,
            calories_burned=250,
            date=datetime.now()
        )
        response = self.client.get('/activities/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.workout_data = {
            'name': 'Test Workout',
            'description': 'Test workout description',
            'difficulty': 'Medium',
            'duration': 30,
            'calories_estimate': 300,
            'category': 'Cardio'
        }

    def test_create_workout(self):
        response = self.client.post('/workouts/', self.workout_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_workouts(self):
        Workout.objects.create(**self.workout_data)
        response = self.client.get('/workouts/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
