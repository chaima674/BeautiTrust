import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import User, Category, BeautySpot, Product

# Get the admin user
admin_user = User.objects.first()
if not admin_user:
    print("No user found! Please create a user first.")
    exit(1)

print(f"Using user: {admin_user.full_name} (ID: {admin_user.id})")

# ALL Beauty Spots (12 items)
beauty_spots_data = [
    {"name": "Glow Salon", "image": "spot1.jpg", "description": "Top-rated salon offering haircuts, coloring, and styling.", "rating": 4.8, "address": "123 Beauty St", "city": "Casablanca"},
    {"name": "Luxe Spa", "image": "spot2.jpg", "description": "Relax and unwind with massages, facials, and aromatherapy.", "rating": 4.6, "address": "456 Relax Ave", "city": "Rabat"},
    {"name": "Bella Beauty", "image": "spot3.jpg", "description": "Premium beauty salon for nails, makeup, and skincare.", "rating": 4.7, "address": "789 Glow Rd", "city": "Marrakech"},
    {"name": "Elite Barber", "image": "spot4.jpg", "description": "Modern barber shop with precision haircuts and beard care.", "rating": 4.5, "address": "101 Style Blvd", "city": "Tangier"},
    {"name": "Radiance Spa", "image": "spot5.jpg", "description": "Luxury spa treatments for face, body, and wellness.", "rating": 4.9, "address": "202 Zen Lane", "city": "Casablanca"},
    {"name": "Chic Nails", "image": "spot6.jpg", "description": "Trendy nail art, gel polish, and nail care services.", "rating": 4.6, "address": "303 Nail St", "city": "Casablanca"},
    {"name": "Urban Hair", "image": "spot7.jpg", "description": "Creative haircuts and professional coloring for all.", "rating": 4.7, "address": "404 Hair Ave", "city": "Rabat"},
    {"name": "Serenity Spa", "image": "spot8.jpg", "description": "Spa with massages, facials, and relaxation packages.", "rating": 4.8, "address": "505 Peace Rd", "city": "Marrakech"},
    {"name": "Glow & Go", "image": "spot9.jpg", "description": "Quick beauty fixes: nails, makeup, and hair touch-ups.", "rating": 4.4, "address": "606 Fast Ln", "city": "Tangier"},
    {"name": "Classic Cuts", "image": "spot10.jpg", "description": "Professional barber services with classic and modern styles.", "rating": 4.5, "address": "707 Classic Blvd", "city": "Casablanca"},
    {"name": "Bliss Nails & Spa", "image": "spot11.jpg", "description": "Relaxing spa and nail services with premium quality products.", "rating": 4.7, "address": "808 Bliss St", "city": "Rabat"},
    {"name": "Style Studio", "image": "spot12.jpg", "description": "Complete hair and beauty services for modern lifestyle.", "rating": 4.6, "address": "909 Style Ave", "city": "Marrakech"},
]

# ALL Products (15 items)
products_data = [
    {"name": "Hydrating Face Cream", "image": "product1.jpg", "description": "Moisturize your skin with natural ingredients.", "price": 75.99, "category": "Skincare"},
    {"name": "Matte Lipstick", "image": "product2.jpg", "description": "Long-lasting matte lipstick with bold colors.", "price": 55.50, "category": "Makeup"},
    {"name": "Volumizing Mascara", "image": "product3.jpg", "description": "Boost your lashes with intense volume and curl.", "price": 19.99, "category": "Makeup"},
    {"name": "Gentle Shampoo", "image": "product4.jpg", "description": "Sulfate-free shampoo for all hair types.", "price": 17.99, "category": "Haircare"},
    {"name": "Anti-aging Serum", "image": "product5.jpg", "description": "Reduce wrinkles and brighten your skin.", "price": 39.99, "category": "Skincare"},
    {"name": "Blush Palette", "image": "product6.jpg", "description": "Add a natural glow to your cheeks.", "price": 35.50, "category": "Makeup"},
    {"name": "Conditioning Hair Mask", "image": "product7.jpg", "description": "Deeply nourishes and repairs hair damage.", "price": 29.99, "category": "Haircare"},
    {"name": "SPF 50 Sunscreen", "image": "product8.jpg", "description": "Protects your skin from harmful UV rays.", "price": 63.99, "category": "Skincare"},
    {"name": "Glossy Lip Balm", "image": "product9.jpg", "description": "Hydrating balm with subtle color.", "price": 9.99, "category": "Makeup"},
    {"name": "Hair Styling Gel", "image": "product10.jpg", "description": "Keep your hair in place all day.", "price": 14.50, "category": "Haircare"},
    {"name": "Face Cleansing Foam", "image": "product11.jpg", "description": "Gentle foam to remove makeup and impurities.", "price": 23.99, "category": "Skincare"},
    {"name": "Liquid Eyeliner", "image": "product12.jpg", "description": "Precise eyeliner for a bold look.", "price": 14.99, "category": "Makeup"},
    {"name": "Nourishing Conditioner", "image": "product13.jpg", "description": "Keep your hair soft and smooth.", "price": 16.99, "category": "Haircare"},
    {"name": "Hydrating Serum", "image": "product14.jpg", "description": "For glowing, healthy skin.", "price": 24.99, "category": "Skincare"},
    {"name": "Eyeshadow Palette", "image": "product15.jpg", "description": "Create endless eye looks with this palette.", "price": 129.99, "category": "Makeup"},
]

# Create categories
categories = {}
category_names = ["Skincare", "Makeup", "Haircare", "Nails", "Wellness"]

print("\nCreating categories...")
for cat_name in category_names:
    cat, created = Category.objects.get_or_create(name=cat_name)
    categories[cat_name] = cat
    print(f"  {'Created' if created else 'Found'} category: {cat_name}")

# Import ALL Beauty Spots
print("\nImporting Beauty Spots...")
for spot in beauty_spots_data:
    obj, created = BeautySpot.objects.get_or_create(
        name=spot["name"],
        defaults={
            "description": spot["description"],
            "rating": spot["rating"],
            "address": spot["address"],
            "city": spot["city"],
            "image_url": f"/static/images/{spot['image']}",
            "provider": admin_user
        }
    )
    print(f"  {'Added' if created else 'Already exists'}: {spot['name']}")

# Import ALL Products
print("\nImporting Products...")
for product in products_data:
    category = categories.get(product["category"], categories["Skincare"])
    obj, created = Product.objects.get_or_create(
        name=product["name"],
        defaults={
            "description": product["description"],
            "price": product["price"],
            "image_url": f"/static/images/{product['image']}",
            "category": category,
            "provider": admin_user
        }
    )
    print(f"  {'Added' if created else 'Already exists'}: {product['name']}")

print("\n IMPORT COMPLETE!")
print(f"   Categories: {Category.objects.count()}")
print(f"   Beauty Spots: {BeautySpot.objects.count()}")
print(f"   Products: {Product.objects.count()}")