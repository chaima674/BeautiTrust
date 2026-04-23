from django.contrib import admin
from .models import (
    User, Category, BeautySpot, Product, Service, 
    Wishlist, Cart, Transaction, Review, Feedback, 
    AdviceResponse, Preference
)

# ========== User Admin ==========
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'role', 'city', 'created_at')
    list_filter = ('role', 'city', 'country')
    search_fields = ('full_name', 'email', 'phone')
    readonly_fields = ('created_at',)

# ========== Category Admin ==========
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# ========== BeautySpot Admin ==========
@admin.register(BeautySpot)
class BeautySpotAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating', 'city', 'provider')
    list_filter = ('city', 'rating')
    search_fields = ('name', 'address', 'city')
    raw_id_fields = ('provider',)

# ========== Product Admin ==========
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'provider')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    raw_id_fields = ('category', 'provider')

# ========== Service Admin ==========
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'beautyspot', 'price')
    list_filter = ('beautyspot',)
    search_fields = ('name', 'description')
    raw_id_fields = ('beautyspot',)

# ========== Wishlist Admin ==========
@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'beautyspot')
    list_filter = ('user',)
    raw_id_fields = ('user', 'product', 'beautyspot')

# ========== Cart Admin ==========
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'service', 'quantity', 'created_at')
    list_filter = ('user',)
    readonly_fields = ('created_at',)
    raw_id_fields = ('user', 'product', 'service')

# ========== Transaction Admin ==========
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'transaction_type', 'total_price', 'status', 'transaction_date')
    list_filter = ('status', 'transaction_type', 'transaction_date')
    search_fields = ('user__full_name',)
    readonly_fields = ('transaction_date',)
    raw_id_fields = ('user', 'product', 'service')

# ========== Review Admin ==========
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'beautyspot', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('comment',)
    raw_id_fields = ('user', 'beautyspot')

# ========== Feedback Admin ==========
@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('message',)
    readonly_fields = ('created_at',)
    raw_id_fields = ('user',)

# ========== AdviceResponse Admin ==========
@admin.register(AdviceResponse)
class AdviceResponseAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('question_text', 'answer_text')
    readonly_fields = ('created_at',)
    raw_id_fields = ('user',)

# ========== Preference Admin ==========
@admin.register(Preference)
class PreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'preferred_name')
    list_filter = ('category',)
    search_fields = ('preferred_name',)
    raw_id_fields = ('user', 'category')