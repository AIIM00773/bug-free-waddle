


from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework.validators import UniqueValidator
from .models import AdminProfile
User = get_user_model()



class AdminUserPayloadSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['profile', 'role']

    def get_profile(self, obj):
        profile = obj.admin_profile
        return {
            'username': obj.username,
            'email': obj.email,
            'phone': profile.phone,
            'first_name': obj.first_name,
            'middle_name': getattr(obj, 'middle_name', ''),
            'last_name': obj.last_name,
            'isAdmin': obj.is_staff,
            'isActive': obj.is_active,
            'isAllowedAcess': profile.is_allowed_access and not profile.is_suspended,
            'isRegistrationVerified': profile.is_registration_verified,
            'isPhoneVerified': profile.is_phone_verified,
            'isEmailVerified': profile.is_email_verified,
            'isIdentityVerified': profile.is_identity_verified,
            'gender': profile.gender,
            'age': profile.age,
            'ethnicity': profile.ethnicity,
            'Country_of_birth': profile.country_of_birth,
            'duration_in_the_company': profile.duration_in_the_company,
            'hasMfaActive': profile.two_factor_enforced,
            'currentMfaSatisfied': True,
            'currentAuthVerified': True,
            'loginHistory': profile.login_history,
        }

    def get_role(self, obj):
        profile = obj.admin_profile
        return {
            'isRolesVerified': len(profile.assigned_roles) > 0,
            'roles': profile.assigned_roles
        }
        
        
        
        
        



# =============================================================================================================================================================



class CreateAdminMemberSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken.")]
    )
    
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already registered.")]
    )
    
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=True)
    middle_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=True)
    
    # Profile payload items mapping to React state properties
    roles = serializers.ListField(
        child=serializers.ChoiceField(choices=AdminProfile.AdminRole.choices),
        min_length=1,
        error_messages={"min_length": "An administrator must be assigned at least one operational role."}
    )
    
    department = serializers.CharField(max_length=100, default="Operations")
    employee_id = serializers.CharField(
        max_length=30,
        validators=[UniqueValidator(queryset=AdminProfile.objects.all(), message="This Employee ID is already assigned.")]
    )
    
    phone = serializers.CharField(max_length=20, required=True)
    gender = serializers.ChoiceField(choices=AdminProfile.GenderChoices.choices)
    age = serializers.IntegerField(min_value=18, max_value=100)
    country_of_birth = serializers.CharField(max_length=100, default="Kenya")


    def create(self, validated_data):
        # Wrap everything in a database transaction to prevent partial state creations if something fails
        with transaction.atomic():
            roles = validated_data.pop('roles')
            department = validated_data.pop('department')
            employee_id = validated_data.pop('employee_id')
            phone = validated_data.pop('phone')
            gender = validated_data.pop('gender')
            age = validated_data.pop('age')
            country_of_birth = validated_data.pop('country_of_birth')
            password = validated_data.pop('password')
            
            # 1. Spin up base User account configuration
            user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                phone = validated_data["phone"],
                is_staff=True,   
                is_active=True
            )
            user.set_password(password)
            # Custom attribute fallback injection safely handled if extending custom models
            if hasattr(user, 'middle_name'):
                user.middle_name = validated_data.get('middle_name', '')
            user.save()

            # 2. Update the AdminProfile (generated automatically via signals, or fetched here)
            profile, created = AdminProfile.objects.get_or_create(user=user)
            profile.assigned_roles = roles
            profile.department = department
            profile.employee_id = employee_id
            profile.phone = phone
            profile.gender = gender
            profile.age = age
            profile.country_of_birth = country_of_birth
            
            # Smart Default: Force password resets and mandate multi-factor setups for new hires
            profile.force_password_change = True
            profile.two_factor_enforced = True
            profile.save()

            return user
