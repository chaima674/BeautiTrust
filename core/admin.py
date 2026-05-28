from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User as DefaultUser
from .models import (
    User, Category, BeautySpot, Product, Service, 
    Wishlist, Cart, Transaction, Review, Feedback, 
    AdviceResponse, Preference, ProductReview  # ← ADDED ProductReview
)

# Unregister the default User model if registered
try:
    admin.site.unregister(DefaultUser)
except:
    pass

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

# ========== Product Admin ==========
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'provider')
    list_filter = ('category',)
    search_fields = ('name', 'description')

# ========== Service Admin ==========
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'beautyspot', 'price')
    list_filter = ('beautyspot',)
    search_fields = ('name', 'description')

# ========== Wishlist Admin ==========
@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'beautyspot')
    list_filter = ('user',)
    search_fields = ('user__full_name',)

# ========== Cart Admin ==========
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'beautyspot', 'service', 'quantity', 'created_at')
    list_filter = ('user',)
    readonly_fields = ('created_at',)
    search_fields = ('user__full_name',)

# ========== Transaction Admin ==========
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'transaction_type', 'total_price', 'commission_amount', 'status', 'transaction_date')
    list_filter = ('status', 'transaction_type', 'transaction_date')
    search_fields = ('user__full_name',)
    readonly_fields = ('transaction_date',)

# ========== Review Admin (Beauty Spot Reviews) ==========
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'beautyspot', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('comment', 'user__full_name')

# ========== Product Review Admin ==========
@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('comment', 'user__full_name', 'product__name')
    readonly_fields = ('created_at',)

# ========== Feedback Admin ==========
@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('message', 'user__full_name')
    readonly_fields = ('created_at',)

# ========== AdviceResponse Admin ==========
@admin.register(AdviceResponse)
class AdviceResponseAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('question_text', 'answer_text', 'user__full_name')
    readonly_fields = ('created_at',)

# ========== Preference Admin ==========
@admin.register(Preference)
class PreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'preferred_name')
    list_filter = ('category',)
    search_fields = ('preferred_name', 'user__full_name')