from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import check_password
from .models import User
from .forms import RegisterForm

def landing(request):
    return render(request, 'landing/index.html')

def home(request):
    return render(request, 'home/home.html', {
        'prefChoice': request.session.get('prefChoice', ''),
        'prefName': request.session.get('prefName', '')
    })

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            request.session['user_id'] = user.id
            messages.success(request, f'Welcome {user.full_name}!')
            return redirect('home')
        else:
            print(form.errors)
    else:
        form = RegisterForm()
    return render(request, 'registration/register.html', {'form': form})

def login_view(request):
    # Get preference from URL
    pref = request.GET.get('pref', '')
    name = request.GET.get('name', '')
    
    print(f"DEBUG: pref from URL = {pref}, name = {name}")
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password_hash):
                request.session['user_id'] = user.id
                
                # Save preference
                if pref and name:
                    request.session['prefChoice'] = pref
                    request.session['prefName'] = name
                    print(f"DEBUG: Saved to session - prefChoice={pref}, prefName={name}")
                
                messages.success(request, f'Welcome back {user.full_name}!')
                return redirect('home')
            else:
                messages.error(request, 'Invalid password')
        except User.DoesNotExist:
            messages.error(request, 'Email not found')
    return render(request, 'registration/login.html')

def logout_view(request):
    # Clear preferences from session
    if 'prefChoice' in request.session:
        del request.session['prefChoice']
    if 'prefName' in request.session:
        del request.session['prefName']
    if 'user_id' in request.session:
        del request.session['user_id']
    return redirect('landing')
def spot_detail(request, spot_id):
    return render(request, 'spot_detail.html', {'spot_id': spot_id})
def product_detail(request, product_id):
    return render(request, 'product_detail.html', {'product_id': product_id})