from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import check_password
from .models import User
from .forms import RegisterForm

def landing(request):
    return render(request, 'landing/index.html')

def home(request):
    return render(request, 'home/home.html')

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            request.session['user_id'] = user.id
            messages.success(request, f'Welcome {user.full_name}!')
            return redirect('home')
        else:
            print(form.errors)  # Debug: see errors in terminal
    else:
        form = RegisterForm()
    return render(request, 'registration/register.html', {'form': form})
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        print(f"Login attempt: {email}")  # Debug print
        
        try:
            user = User.objects.get(email=email)
            print(f"User found: {user.full_name}")  # Debug print
            print(f"Password in DB: {user.password_hash}")  # Debug print
            
            if check_password(password, user.password_hash):
                request.session['user_id'] = user.id
                messages.success(request, f'Welcome back {user.full_name}!')
                print("Login successful!")  # Debug print
                return redirect('home')
            else:
                print("Password incorrect")  # Debug print
                messages.error(request, 'Invalid password')
        except User.DoesNotExist:
            print("User not found")  # Debug print
            messages.error(request, 'Email not found')
    
    return render(request, 'registration/login.html')
def logout_view(request):
    if 'user_id' in request.session:
        del request.session['user_id']
    return redirect('landing')