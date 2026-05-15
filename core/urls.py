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
]