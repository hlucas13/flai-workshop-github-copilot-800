from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class TeamSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = '__all__'

    def get_member_count(self, obj):
        # Count users with this team's ID
        return User.objects.filter(team_id=str(obj.id)).count()


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class LeaderboardSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    team_name = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = '__all__'

    def get_user_name(self, obj):
        try:
            user = User.objects.get(id=obj.user_id)
            return user.name
        except (User.DoesNotExist, ValueError):
            return obj.user_id

    def get_team_name(self, obj):
        try:
            team = Team.objects.get(id=obj.team_id)
            return team.name
        except (Team.DoesNotExist, ValueError):
            return "No Team"


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
