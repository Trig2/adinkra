from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from .models import User
import json


@ensure_csrf_cookie
@require_http_methods(["POST"])
def register_user(request):
    """Register a new user via API"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        phone_number = data.get('phone_number', '')
        community = data.get('community', '')
        
        # Validation
        if not username or not email or not password:
            return JsonResponse({'error': 'Username, email and password are required'}, status=400)
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            community=community
        )
        
        # Log the user in
        login(request, user)
        
        return JsonResponse({
            'success': True,
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'total_points': user.total_points
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@ensure_csrf_cookie
@require_http_methods(["POST"])
def login_user(request):
    """Login user via API"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'total_points': user.total_points
                }
            })
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["POST"])
def logout_user(request):
    """Logout user via API"""
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logout successful'})


@require_http_methods(["GET"])
def check_auth(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        return JsonResponse({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'total_points': request.user.total_points
            }
        })
    else:
        return JsonResponse({'authenticated': False})

