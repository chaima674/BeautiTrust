from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('', views.landing, name='landing'),
    path('home/', views.home, name='home'),
    path('api/spots/', api.get_spots, name='api_spots'),
    path('api/products/', api.get_products, name='api_products'),
    path('api/check-auth/', api.check_auth, name='check_auth'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('api/save-preference/', api.save_preference, name='save_preference'),
    path('api/reviews/', api.get_reviews, name='api_reviews'),
    path('api/add-review/', api.add_review, name='add_review'),
    path('spot/<int:spot_id>/', views.spot_detail, name='spot_detail'),
    path('api/spot/<int:spot_id>/', api.get_spot_detail, name='api_spot_detail'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('api/product/<int:product_id>/', api.get_product_detail, name='api_product_detail'),
    path('api/product-reviews/', api.get_product_reviews, name='api_product_reviews'),
    path('api/add-product-review/', api.add_product_review, name='add_product_review'),
    path('api/advice-responses/', api.get_advice_responses, name='api_advice_responses'),
    path('api/save-advice-response/', api.save_advice_response, name='save_advice_response'),
    path('api/add-feedback/', api.add_feedback, name='add_feedback'),
    path('api/add-to-cart/', api.add_to_cart, name='add_to_cart'),
    path('api/add-to-wishlist/', api.add_to_wishlist, name='add_to_wishlist'),
    path('api/create-transaction/', api.create_transaction, name='create_transaction'),
    path('api/get-user-cart/', api.get_user_cart, name='get_user_cart'),
    path('api/get-user-wishlist/', api.get_user_wishlist, name='get_user_wishlist'),
    path('api/clear-user-cart/', api.clear_user_cart, name='clear_user_cart'),
    path('api/remove-cart-item/', api.remove_cart_item, name='remove_cart_item'),
    # NEW: Save user preference to database
    path('api/save-user-preference/', api.save_user_preference, name='save_user_preference'),
]