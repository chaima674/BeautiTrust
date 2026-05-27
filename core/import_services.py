import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import BeautySpot, Service

# Get all beauty spots
spots = {spot.name: spot for spot in BeautySpot.objects.all()}

# Delete existing services
Service.objects.all().delete()

# Services for ALL 12 beauty spots
services_data = [
    # 1. Glow Salon
    (spots["Glow Salon"], "Haircut", "Professional haircut with styling", 50),
    (spots["Glow Salon"], "Hair Coloring", "Full hair coloring with premium products", 150),
    (spots["Glow Salon"], "Hair Styling", "Professional blowout and styling", 80),
    
    # 2. Luxe Spa
    (spots["Luxe Spa"], "Massage", "Relaxing full body massage", 120),
    (spots["Luxe Spa"], "Facial", "Deep cleansing facial treatment", 90),
    (spots["Luxe Spa"], "Aromatherapy", "Essential oils therapy session", 70),
    
    # 3. Bella Beauty
    (spots["Bella Beauty"], "Manicure", "Classic manicure with polish", 40),
    (spots["Bella Beauty"], "Pedicure", "Spa pedicure treatment", 55),
    (spots["Bella Beauty"], "Makeup", "Professional makeup application", 80),
    
    # 4. Elite Barber
    (spots["Elite Barber"], "Haircut", "Precision haircut by expert barber", 45),
    (spots["Elite Barber"], "Beard Trim", "Professional beard shaping", 25),
    (spots["Elite Barber"], "Shaving", "Classic hot towel shave", 35),
    
    # 5. Radiance Spa
    (spots["Radiance Spa"], "Facial", "Luxury anti-aging facial", 120),
    (spots["Radiance Spa"], "Body Scrub", "Exfoliating body treatment", 85),
    (spots["Radiance Spa"], "Wellness Package", "Full day spa experience", 250),
    
    # 6. Chic Nails
    (spots["Chic Nails"], "Manicure", "Gel manicure", 45),
    (spots["Chic Nails"], "Nail Art", "Custom nail art design", 30),
    (spots["Chic Nails"], "Gel Polish", "Long-lasting gel polish", 40),
    
    # 7. Urban Hair
    (spots["Urban Hair"], "Haircut", "Creative haircut", 55),
    (spots["Urban Hair"], "Hair Coloring", "Balayage and highlights", 180),
    (spots["Urban Hair"], "Hair Styling", "Wedding/event styling", 90),
    
    # 8. Serenity Spa
    (spots["Serenity Spa"], "Massage", "Deep tissue massage", 110),
    (spots["Serenity Spa"], "Facial", "Hydrating facial", 85),
    (spots["Serenity Spa"], "Relaxation Package", "Massage + facial combo", 180),
    
    # 9. Glow & Go
    (spots["Glow & Go"], "Makeup", "Express makeup", 50),
    (spots["Glow & Go"], "Manicure", "Quick manicure", 30),
    (spots["Glow & Go"], "Hair Styling", "Quick styling", 40),
    
    # 10. Classic Cuts
    (spots["Classic Cuts"], "Haircut", "Classic men's haircut", 35),
    (spots["Classic Cuts"], "Beard Care", "Beard grooming", 20),
    (spots["Classic Cuts"], "Hot Towel Shave", "Luxury shave experience", 40),
    
    # 11. Bliss Nails & Spa
    (spots["Bliss Nails & Spa"], "Pedicure", "Spa pedicure", 60),
    (spots["Bliss Nails & Spa"], "Manicure", "Luxury manicure", 45),
    (spots["Bliss Nails & Spa"], "Facial", "Signature facial", 80),
    
    # 12. Style Studio
    (spots["Style Studio"], "Haircut", "Fashion haircut", 60),
    (spots["Style Studio"], "Makeup", "Glam makeup", 100),
    (spots["Style Studio"], "Hair Styling", "Red carpet styling", 85),
]

# Add all services
for spot, name, desc, price in services_data:
    service = Service.objects.create(
        beautyspot=spot,
        name=name,
        description=desc,
        price=price
    )
    print(f'Added: {spot.name} - {name} ({price} DT)')

print(f'\n✅ Total services added: {Service.objects.count()}')