from django.core.management.base import BaseCommand
from api.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        
        # Delete all existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data cleared.'))
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes fitness team'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League fitness champions'
        )
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))
        
        # Create Marvel Users
        self.stdout.write('Creating Marvel users...')
        marvel_users = [
            User.objects.create(
                name='Tony Stark',
                email='ironman@marvel.com',
                password='iamironman',
                team_id=str(team_marvel.id)
            ),
            User.objects.create(
                name='Steve Rogers',
                email='captainamerica@marvel.com',
                password='icandothisallday',
                team_id=str(team_marvel.id)
            ),
            User.objects.create(
                name='Thor Odinson',
                email='thor@marvel.com',
                password='worthy',
                team_id=str(team_marvel.id)
            ),
            User.objects.create(
                name='Natasha Romanoff',
                email='blackwidow@marvel.com',
                password='redroom',
                team_id=str(team_marvel.id)
            ),
            User.objects.create(
                name='Bruce Banner',
                email='hulk@marvel.com',
                password='smash',
                team_id=str(team_marvel.id)
            ),
        ]
        
        # Create DC Users
        self.stdout.write('Creating DC users...')
        dc_users = [
            User.objects.create(
                name='Clark Kent',
                email='superman@dc.com',
                password='krypton',
                team_id=str(team_dc.id)
            ),
            User.objects.create(
                name='Bruce Wayne',
                email='batman@dc.com',
                password='gotham',
                team_id=str(team_dc.id)
            ),
            User.objects.create(
                name='Diana Prince',
                email='wonderwoman@dc.com',
                password='themyscira',
                team_id=str(team_dc.id)
            ),
            User.objects.create(
                name='Barry Allen',
                email='flash@dc.com',
                password='speedforce',
                team_id=str(team_dc.id)
            ),
            User.objects.create(
                name='Arthur Curry',
                email='aquaman@dc.com',
                password='atlantis',
                team_id=str(team_dc.id)
            ),
        ]
        
        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Swimming', 'Weightlifting', 'Cycling', 'Boxing', 'Yoga']
        activities_created = 0
        
        for user in all_users:
            for i in range(5):  # 5 activities per user
                activity_type = activity_types[i % len(activity_types)]
                duration = 30 + (i * 10)
                calories = duration * 8
                
                Activity.objects.create(
                    user_id=str(user.id),
                    activity_type=activity_type,
                    duration=duration,
                    calories_burned=calories,
                    date=datetime.now() - timedelta(days=i),
                    notes=f'{user.name} completed a {activity_type} session'
                )
                activities_created += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {activities_created} activities'))
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        for user in all_users:
            user_activities = Activity.objects.filter(user_id=str(user.id))
            total_calories = sum(activity.calories_burned for activity in user_activities)
            total_activities_count = user_activities.count()
            
            Leaderboard.objects.create(
                user_id=str(user.id),
                team_id=user.team_id,
                total_calories=total_calories,
                total_activities=total_activities_count,
                rank=0  # Will be calculated based on calories
            )
        
        # Update ranks based on total calories
        leaderboard_entries = Leaderboard.objects.all().order_by('-total_calories')
        for rank, entry in enumerate(leaderboard_entries, start=1):
            entry.rank = rank
            entry.save()
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} leaderboard entries'))
        
        # Create Workouts
        self.stdout.write('Creating workout suggestions...')
        workouts = [
            Workout.objects.create(
                name='Super Soldier Training',
                description='High-intensity interval training inspired by Captain America',
                difficulty='Hard',
                duration=45,
                calories_estimate=400,
                category='HIIT'
            ),
            Workout.objects.create(
                name='Arc Reactor Cardio',
                description='Advanced cardio workout for peak performance',
                difficulty='Medium',
                duration=30,
                calories_estimate=300,
                category='Cardio'
            ),
            Workout.objects.create(
                name='Asgardian Strength',
                description='Heavy lifting routine worthy of Thor',
                difficulty='Hard',
                duration=60,
                calories_estimate=500,
                category='Strength'
            ),
            Workout.objects.create(
                name='Widow\'s Flexibility',
                description='Flexibility and agility training program',
                difficulty='Medium',
                duration=40,
                calories_estimate=250,
                category='Flexibility'
            ),
            Workout.objects.create(
                name='Speedforce Sprint',
                description='Lightning-fast sprint intervals',
                difficulty='Hard',
                duration=25,
                calories_estimate=350,
                category='Cardio'
            ),
            Workout.objects.create(
                name='Gotham Guardian',
                description='Batman-inspired bodyweight exercises',
                difficulty='Medium',
                duration=35,
                calories_estimate=280,
                category='Bodyweight'
            ),
            Workout.objects.create(
                name='Amazonian Warrior',
                description='Combat-ready strength and endurance training',
                difficulty='Hard',
                duration=50,
                calories_estimate=450,
                category='Combat'
            ),
            Workout.objects.create(
                name='Kryptonian Power',
                description='Maximum strength building workout',
                difficulty='Hard',
                duration=55,
                calories_estimate=480,
                category='Strength'
            ),
        ]
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workout suggestions'))
        
        self.stdout.write(self.style.SUCCESS('Database population completed successfully!'))
        self.stdout.write(self.style.SUCCESS(f'Total Users: {User.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Total Teams: {Team.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Total Activities: {Activity.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Total Leaderboard Entries: {Leaderboard.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Total Workouts: {Workout.objects.count()}'))
