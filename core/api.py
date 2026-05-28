from django.http import JsonResponse
from .models import BeautySpot, Product, User, Service
from django.contrib.auth.hashers import check_password, make_password
from django.views.decorators.csrf import csrf_exempt
import json

# ========== SPOTS & PRODUCTS API ==========

def get_spots(request):
    """Get all beauty spots with their services"""
    spots = BeautySpot.objects.all()
    data = []
    for spot in spots:
        services = list(Service.objects.filter(beautyspot=spot).values_list('name', flat=True))
        data.append({
            'id': spot.id,
            'name': spot.name,
            'description': spot.description,
            'image_url': spot.image_url,
            'rating': float(spot.rating),
            'address': spot.address,
            'city': spot.city,
            'services': services
        })
    return JsonResponse(data, safe=False)

def get_products(request):
    """Get all products with their category"""
    products = Product.objects.all()
    data = []
    for product in products:
        data.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'image_url': product.image_url,
            'price': float(product.price),
            'category': product.category.name if product.category else None
        })
    return JsonResponse(data, safe=False)

# ========== AUTHENTICATION API ==========

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

@csrf_exempt
def save_preference(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        request.session['prefChoice'] = data.get('preference')
        request.session['prefName'] = data.get('name')
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

# ========== SPOT DETAIL API ==========

def get_spot_detail(request, spot_id):
    """Get detailed information about a specific beauty spot"""
    try:
        spot = BeautySpot.objects.get(id=spot_id)
        services = list(Service.objects.filter(beautyspot=spot).values('id', 'name', 'description', 'price'))
        reviews = list(spot.reviews.values('id', 'user__full_name', 'rating', 'comment', 'created_at'))
        if reviews:
            avg_rating = sum(r['rating'] for r in reviews) / len(reviews)
        else:
            avg_rating = float(spot.rating)
        
        spot_data = {
            'id': spot.id,
            'name': spot.name,
            'description': spot.description,
            'rating': round(avg_rating, 1),
            'address': spot.address,
            'city': spot.city,
            'image_url': spot.image_url,
            'provider_name': spot.provider.full_name if spot.provider else '',
            'provider_phone': spot.provider.phone if spot.provider else '',
            'provider_email': spot.provider.email if spot.provider else '',
            'services': services,
            'reviews': reviews,
            'review_count': len(reviews)
        }
        return JsonResponse(spot_data, safe=False)
    except BeautySpot.DoesNotExist:
        return JsonResponse({'error': 'Spot not found'}, status=404)

# ========== PRODUCT DETAIL API ==========

def get_product_detail(request, product_id):
    from .models import ProductReview
    try:
        product = Product.objects.get(id=product_id)
        reviews = list(ProductReview.objects.filter(product_id=product_id).values(
            'id', 'user__full_name', 'rating', 'comment', 'created_at'
        ))
        if reviews:
            avg_rating = sum(r['rating'] for r in reviews) / len(reviews)
        else:
            avg_rating = 0
        
        product_data = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'image_url': product.image_url,
            'category': product.category.name if product.category else '',
            'avg_rating': round(avg_rating, 1),
            'review_count': len(reviews),
            'provider_name': product.provider.full_name if product.provider else '',
            'provider_phone': product.provider.phone if product.provider else '',
            'provider_email': product.provider.email if product.provider else '',
            'provider_city': product.provider.city if product.provider else '',
            'reviews': reviews,
        }
        return JsonResponse(product_data, safe=False)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)

# ========== REVIEWS API ==========

def get_reviews(request):
    from .models import Review
    reviews = list(Review.objects.values(
        'id', 'user__full_name', 'beautyspot__name', 'beautyspot_id', 'rating', 'comment', 'created_at'
    ))
    return JsonResponse(reviews, safe=False)

@csrf_exempt
def add_review(request):
    from .models import Review
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Please login to leave a review'})
    
    try:
        data = json.loads(request.body)
        review = Review.objects.create(
            user_id=user_id,
            beautyspot_id=data.get('beautyspot_id'),
            rating=data.get('rating'),
            comment=data.get('comment')
        )
        return JsonResponse({'success': True, 'review_id': review.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# ========== PRODUCT REVIEWS API ==========

def get_product_reviews(request):
    from .models import ProductReview
    reviews = list(ProductReview.objects.values(
        'id', 'user__full_name', 'product__name', 'product_id', 'rating', 'comment', 'created_at'
    ))
    return JsonResponse(reviews, safe=False)

@csrf_exempt
def add_product_review(request):
    from .models import ProductReview
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Please login to leave a review'})
    
    try:
        data = json.loads(request.body)
        review = ProductReview.objects.create(
            user_id=user_id,
            product_id=data.get('product_id'),
            rating=data.get('rating'),
            comment=data.get('comment')
        )
        return JsonResponse({'success': True, 'review_id': review.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# ========== ADVICE RESPONSES API ==========

def get_advice_responses(request):
    from .models import AdviceResponse
    responses = list(AdviceResponse.objects.values(
        'id', 'user__full_name', 'question_text', 'answer_text', 'created_at'
    ))
    return JsonResponse(responses, safe=False)

@csrf_exempt
def save_advice_response(request):
    from .models import AdviceResponse
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Please login to save advice'})
    
    try:
        data = json.loads(request.body)
        question_text = data.get('question_text')
        answer_text = data.get('answer_text')
        response = AdviceResponse.objects.create(
            user_id=user_id,
            question_text=question_text,
            answer_text=answer_text
        )
        return JsonResponse({'success': True, 'response_id': response.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# ========== FEEDBACK API ==========

@csrf_exempt
def add_feedback(request):
    from .models import Feedback
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Please login to submit feedback'})
    
    try:
        data = json.loads(request.body)
        feedback = Feedback.objects.create(
            user_id=user_id,
            message=data.get('message')
        )
        return JsonResponse({'success': True, 'feedback_id': feedback.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# ========== CART API ==========

@csrf_exempt
def add_to_cart(request):
    from .models import Cart
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Please login'})
    
    try:
        data = json.loads(request.body)
        item_type = data.get('item_type')
        item_id = data.get('item_id')
        
        if item_type == 'spot':
            item = BeautySpot.objects.get(id=item_id)
            Cart.objects.create(user_id=user_id, beautyspot=item, quantity=1)
        elif item_type == 'product':
            item = Product.objects.get(id=item_id)
            Cart.objects.create(user_id=user_id, product=item, quantity=1)
        elif item_type == 'service':
            item = Service.objects.get(id=item_id)
            Cart.objects.create(user_id=user_id, service=item, quantity=1)
        else:
            return JsonResponse({'success': False, 'error': 'Invalid item_type'})
        
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# ========== WISHLIST API ==========

@csrf_exempt
def add_to_wishlist(request):
    from .models import Wishlist
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Please login'})
    
    try:
        data = json.loads(request.body)
        item_type = data.get('item_type')
        item_id = data.get('item_id')
        
        if item_type == 'spot':
            item = BeautySpot.objects.get(id=item_id)
            Wishlist.objects.create(user_id=user_id, beautyspot=item)
        else:
            item = Product.objects.get(id=item_id)
            Wishlist.objects.create(user_id=user_id, product=item)
        
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# ========== TRANSACTION API ==========

@csrf_exempt
def create_transaction(request):
    from .models import Transaction
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Please login'})
    
    try:
        data = json.loads(request.body)
        item_type = data.get('item_type')
        item_id = data.get('item_id')
        price = data.get('price', 50)
        commission = price * 0.10
        
        # Determine transaction_type (must be 'product' or 'service')
        if item_type == 'product':
            mapped_type = 'product'
        elif item_type == 'service' or item_type == 'spot':
            mapped_type = 'service'
        else:
            return JsonResponse({'success': False, 'error': 'Invalid item_type for transaction'})
        
        transaction = Transaction.objects.create(
            user_id=user_id,
            total_price=price,
            commission_amount=commission,
            status='completed',
            transaction_type=mapped_type
        )
        
        if item_type == 'product':
            product = Product.objects.get(id=item_id)
            transaction.product = product
        elif item_type == 'service':
            service = Service.objects.get(id=item_id)
            transaction.service = service
        else:  # 'spot' fallback (for backward compatibility)
            spot = BeautySpot.objects.get(id=item_id)
            transaction.beautyspot = spot
        
        transaction.save()
        return JsonResponse({'success': True, 'transaction_id': transaction.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# ========== GET USER CART & WISHLIST API ==========

def get_user_cart(request):
    """Get current user's cart items including cart item IDs"""
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'cart': []})
    
    from .models import Cart
    cart_items = Cart.objects.filter(user_id=user_id)
    data = []
    for item in cart_items:
        if item.product:
            data.append({
                'cart_item_id': item.id,
                'id': item.product.id,
                'name': item.product.name,
                'price': float(item.product.price),
                'image_url': item.product.image_url,
                'type': 'product',
                'quantity': item.quantity
            })
        elif item.beautyspot:
            data.append({
                'cart_item_id': item.id,
                'id': item.beautyspot.id,
                'name': item.beautyspot.name,
                'image_url': item.beautyspot.image_url,
                'type': 'spot',
                'quantity': item.quantity
            })
        elif item.service:
            spot = item.service.beautyspot
            data.append({
                'cart_item_id': item.id,
                'id': item.service.id,
                'name': item.service.name,
                'price': float(item.service.price),
                'image_url': spot.image_url,
                'type': 'service',
                'service_name': item.service.name,
                'quantity': item.quantity
            })
    return JsonResponse({'cart': data})

def get_user_wishlist(request):
    """Get current user's wishlist items"""
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'wishlist': []})
    
    from .models import Wishlist
    wishlist_items = Wishlist.objects.filter(user_id=user_id)
    data = []
    for item in wishlist_items:
        if item.product:
            data.append({
                'id': item.product.id,
                'name': item.product.name,
                'price': float(item.product.price),
                'image_url': item.product.image_url,
                'type': 'product'
            })
        elif item.beautyspot:
            data.append({
                'id': item.beautyspot.id,
                'name': item.beautyspot.name,
                'image_url': item.beautyspot.image_url,
                'type': 'spot'
            })
    return JsonResponse({'wishlist': data})

@csrf_exempt
def clear_user_cart(request):
    """Clear user's cart on logout"""
    user_id = request.session.get('user_id')
    if user_id:
        from .models import Cart
        Cart.objects.filter(user_id=user_id).delete()
    return JsonResponse({'success': True})

# ========== REMOVE CART ITEM API ==========

@csrf_exempt
def remove_cart_item(request):
    """Remove a specific item from the user's cart"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Please login'})
    
    try:
        data = json.loads(request.body)
        cart_item_id = data.get('cart_item_id')
        if not cart_item_id:
            return JsonResponse({'success': False, 'error': 'Missing cart_item_id'})
        
        from .models import Cart
        deleted = Cart.objects.filter(id=cart_item_id, user_id=user_id).delete()
        if deleted[0]:
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Item not found'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# ========== SAVE USER PREFERENCE ==========

@csrf_exempt
def save_user_preference(request):
    """Save user's preference to database (Preference model)"""
    from .models import Preference, Category
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid method'})
    
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Not logged in'})
    
    try:
        data = json.loads(request.body)
        pref_choice = data.get('preference')
        pref_name = data.get('name')
        
        category_map = {
            'Hair': 'Haircare',
            'Skin': 'Skincare',
            'Nails': 'Nails',
            'Makeup': 'Makeup'
        }
        cat_name = category_map.get(pref_choice)
        if cat_name:
            category, _ = Category.objects.get_or_create(name=cat_name)
            Preference.objects.update_or_create(
                user_id=user_id,
                category=category,
                defaults={'preferred_name': pref_name}
            )
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})