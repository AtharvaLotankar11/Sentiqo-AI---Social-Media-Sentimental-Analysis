from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import UserProfile

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = User.objects.create_user(username=username, password=password, email=email)
    
    # Initialize UserProfile
    UserProfile.objects.create(user=user)
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': {
            'username': user.username,
            'email': user.email
        },
        'token': str(refresh.access_token),
        'refresh': str(refresh)
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login and return tokens
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': {
            'username': user.username,
            'email': user.email
        },
        'token': str(refresh.access_token),
        'refresh': str(refresh)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update user profile data (first_name, last_name, email, profile_pic)
    """
    user = request.user
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.email = request.data.get('email', user.email)
    user.save()
    
    # Update Profile Pic in UserProfile
    profile, created = UserProfile.objects.get_or_create(user=user)
    if 'profile_pic' in request.data:
        profile.profile_pic = request.data.get('profile_pic')
        profile.save()
    
    # Recalculate initials for response
    initials = ""
    if user.first_name and user.last_name:
        initials = f"{user.first_name[0]}{user.last_name[0]}".upper()
    else:
        initials = user.username[0:2].upper()
        
    return Response({
        'message': 'Profile updated successfully',
        'initials': initials,
        'username': user.username,
        'email': user.email,
        'profile_pic': profile.profile_pic
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change user password
    """
    user = request.user
    password = request.data.get('password')
    if not password:
        return Response({'error': 'New password required'}, status=status.HTTP_400_BAD_REQUEST)
        
    user.set_password(password)
    user.save()
    return Response({'message': 'Password reset successful'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get current user profile with initials fallback logic
    """
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)
    
    # Calculate Initials
    if user.first_name and user.last_name:
        initials = f"{user.first_name[0]}{user.last_name[0]}".upper()
    elif user.first_name:
        initials = user.first_name[0:2].upper()
    else:
        initials = user.username[0:2].upper()
        
    return Response({
        'username': user.username,
        'email': user.email,
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'initials': initials,
        'profile_pic': profile.profile_pic
    })
