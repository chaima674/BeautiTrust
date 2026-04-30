from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('', views.landing, name='landing'),
    path('home/', views.home, name='home'),
    path('api/spots/', api.get_spots, name='api_spots'),
    path('api/products/', api.get_products, name='api_products'),
]