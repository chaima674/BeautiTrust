from django.http import JsonResponse
from .models import BeautySpot, Product, User
from django.contrib.auth.hashers import check_password, make_password
from django.views.decorators.csrf import csrf_exempt
import json

def get_spots(request):
    spots = list(BeautySpot.objects.values())
    return JsonResponse(spots, safe=False)

def get_products(request):
    products = list(Product.objects.values())
    return JsonResponse(products, safe=False)

def check_auth(request):
    user_id = request.session.get('user_id')
    return JsonResponse({'is_authenticated': user_id is not None})

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password_hash):
                request.session['user_id'] = user.id
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'error': 'Invalid password'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Email not found'})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})

@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        if User.objects.filter(email=data.get('email')).exists():
            return JsonResponse({'success': False, 'error': 'Email already registered'})
        
        user = User.objects.create(
            full_name=data.get('full_name'),
            email=data.get('email'),
            phone=data.get('phone'),
            city=data.get('city'),
            country='Tunisia',
            role='customer',
            password_hash=make_password(data.get('password'))
        )
        
        request.session['user_id'] = user.id
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})
def check_auth(request):
    user_id = request.session.get('user_id')
    return JsonResponse({'is_authenticated': user_id is not None})