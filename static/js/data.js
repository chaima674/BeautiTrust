// ===== Beauty Spots =====
const beautySpots = [
    { id: 1, name: "Glow Salon", image: "images/spot1.jpg", description: "Top-rated salon offering haircuts, coloring, and styling.", rating: 4.8, services: ["Haircut", "Hair Coloring", "Styling"] },
    { id: 2, name: "Luxe Spa", image: "images/spot2.jpg", description: "Relax and unwind with massages, facials, and aromatherapy.", rating: 4.6, services: ["Massage", "Facial", "Aromatherapy"] },
    { id: 3, name: "Bella Beauty", image: "images/spot3.jpg", description: "Premium beauty salon for nails, makeup, and skincare.", rating: 4.7, services: ["Manicure", "Pedicure", "Makeup"] },
    { id: 4, name: "Elite Barber", image: "images/spot4.jpg", description: "Modern barber shop with precision haircuts and beard care.", rating: 4.5, services: ["Haircut", "Beard Trim", "Shaving"] },
    { id: 5, name: "Radiance Spa", image: "images/spot5.jpg", description: "Luxury spa treatments for face, body, and wellness.", rating: 4.9, services: ["Facial", "Body Scrub", "Wellness"] },
    { id: 6, name: "Chic Nails", image: "images/spot6.jpg", description: "Trendy nail art, gel polish, and nail care services.", rating: 4.6, services: ["Manicure", "Nail Art", "Gel Polish"] },
    { id: 7, name: "Urban Hair", image: "images/spot7.jpg", description: "Creative haircuts and professional coloring for all.", rating: 4.7, services: ["Haircut", "Hair Coloring", "Styling"] },
    { id: 8, name: "Serenity Spa", image: "images/spot8.jpg", description: "Spa with massages, facials, and relaxation packages.", rating: 4.8, services: ["Massage", "Facial", "Relaxation"] },
    { id: 9, name: "Glow & Go", image: "images/spot9.jpg", description: "Quick beauty fixes: nails, makeup, and hair touch-ups.", rating: 4.4, services: ["Makeup", "Manicure", "Hair Styling"] },
    { id: 10, name: "Classic Cuts", image: "images/spot10.jpg", description: "Professional barber services with classic and modern styles.", rating: 4.5, services: ["Haircut", "Beard Care"] },
    { id: 11, name: "Bliss Nails & Spa", image: "images/spot11.jpg", description: "Relaxing spa and nail services with premium quality products.", rating: 4.7, services: ["Pedicure", "Manicure", "Facial"] },
    { id: 12, name: "Style Studio", image: "images/spot12.jpg", description: "Complete hair and beauty services for modern lifestyle.", rating: 4.6, services: ["Haircut", "Makeup", "Hair Styling"] }
];

// ===== Products =====
const products = [
    { id: 1, name: "Hydrating Face Cream", image: "images/product1.jpg", description: "Moisturize your skin with natural ingredients.", price: 75.99, rating: 4.7, category: "Skincare" },
    { id: 2, name: "Matte Lipstick", image: "images/product2.jpg", description: "Long-lasting matte lipstick with bold colors.", price: 55.50, rating: 4.6, category: "Makeup" },
    { id: 3, name: "Volumizing Mascara", image: "images/product3.jpg", description: "Boost your lashes with intense volume and curl.", price: 19.99, rating: 4.5, category: "Makeup" },
    { id: 4, name: "Gentle Shampoo", image: "images/product4.jpg", description: "Sulfate-free shampoo for all hair types.", price: 17.99, rating: 4.6, category: "Haircare" },
    { id: 5, name: "Anti-aging Serum", image: "images/product5.jpg", description: "Reduce wrinkles and brighten your skin.", price: 39.99, rating: 4.8, category: "Skincare" },
    { id: 6, name: "Blush Palette", image: "images/product6.jpg", description: "Add a natural glow to your cheeks.", price: 35.50, rating: 4.4, category: "Makeup" },
    { id: 7, name: "Conditioning Hair Mask", image: "images/product7.jpg", description: "Deeply nourishes and repairs hair damage.", price: 29.99, rating: 4.7, category: "Haircare" },
    { id: 8, name: "SPF 50 Sunscreen", image: "images/product8.jpg", description: "Protects your skin from harmful UV rays.", price: 63.99, rating: 4.6, category: "Skincare" },
    { id: 9, name: "Glossy Lip Balm", image: "images/product9.jpg", description: "Hydrating balm with subtle color.", price: 9.99, rating: 4.5, category: "Makeup" },
    { id: 10, name: "Hair Styling Gel", image: "images/product10.jpg", description: "Keep your hair in place all day.", price: 14.50, rating: 4.4, category: "Haircare" },
    { id: 11, name: "Face Cleansing Foam", image: "images/product11.jpg", description: "Gentle foam to remove makeup and impurities.", price: 23.99, rating: 4.6, category: "Skincare" },
    { id: 12, name: "Liquid Eyeliner", image: "images/product12.jpg", description: "Precise eyeliner for a bold look.", price: 14.99, rating: 4.7, category: "Makeup" },
    { id: 13, name: "Nourishing Conditioner", image: "images/product13.jpg", description: "Keep your hair soft and smooth.", price: 16.99, rating: 4.5, category: "Haircare" },
    { id: 14, name: "Hydrating Serum", image: "images/product14.jpg", description: "For glowing, healthy skin.", price: 24.99, rating: 4.6, category: "Skincare" },
    { id: 15, name: "Eyeshadow Palette", image: "images/product15.jpg", description: "Create endless eye looks with this palette.", price: 129.99, rating: 4.8, category: "Makeup" }
];

// ===== Personalized Advice Questions =====
const adviceQuestions = [
    { id: 1, question: "What is your skin type?", options: ["Oily", "Dry", "Combination", "Sensitive"] },
    { id: 2, question: "What is your main concern?", options: ["Acne", "Aging", "Dryness", "Redness"] },
    { id: 3, question: "How often do you use makeup?", options: ["Daily", "Weekly", "Occasionally", "Never"] },
    { id: 4, question: "Do you prefer natural or bold looks?", options: ["Natural", "Bold"] },
    { id: 5, question: "Do you have any allergies?", options: ["Yes", "No"] },
    { id: 6, question: "What type of products do you prefer?", options: ["Skincare", "Makeup", "Haircare", "Wellness"] },
    { id: 7, question: "What is your budget range?", options: ["Low", "Medium", "High"] }
];

// ===== Wishlist / Cart =====
const wishlist = [];
const cart = [];
const favorites = [];