from django.http import JsonResponse
from .models import BeautySpot, Product

def get_spots(request):
    spots = list(BeautySpot.objects.values())
    return JsonResponse(spots, safe=False)

def get_products(request):
    products = list(Product.objects.values())
    return JsonResponse(products, safe=False)