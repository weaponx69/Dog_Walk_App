from rest_framework import serializers
from rest_framework_gis.fields import GeometryField
from .models import Dog, WalkRequest

class DogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dog
        fields = '__all__'

class WalkRequestSerializer(serializers.ModelSerializer):
    pickup_location = GeometryField()
    class Meta:
        model = WalkRequest
        fields = '__all__'
