### This Django `views.py` file handles Firebase-based user authentication (signup, login, logout, session management) 
#   and renders appropriate frontend pages using session-based access control.

# Import JSON response utility to return API-friendly responses; connect frontend with backend for auth reasons
from django.http import JsonResponse    
# Import render for rendering HTML templates, redirect for route redirection
from django.shortcuts import render, redirect
# Import Firebase Admin SDK's authentication module
from firebase_admin import auth
# Import JSON to parse request body
import json
# Decorators to allow views to bypass CSRF check and restrict allowed HTTP methods
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Render the landing page (homepage)
def landing_page(request):
    return render(request, 'authentication/final_landing.html')

# Render the login page if user not logged in, else redirect to dashboard
def login_page(request):
    if request.session.get('user_id'):  # If user is already logged in
        return redirect('dashboard')    # Redirect to dashboard
    return render(request, 'authentication/final_login.html')  # Else show login page

# Render the signup page if user not logged in, else redirect to dashboard
def signup_page(request):
    if request.session.get('user_id'):  # If user is already logged in
        return redirect('dashboard')    # Redirect to dashboard
    return render(request, 'authentication/final_signup.html')  # Else show signup page

# Render dashboard if user is authenticated, else redirect to login
def dashboard_page(request):
    if not request.session.get('user_id'):  # If user is not logged in
        return redirect('login')            # Redirect to login page
    return render(request, 'authentication/final_dashboard.html')  # Show dashboard

# Signup API endpoint — expects POST or OPTIONS requests
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def signup(request):
    # Handle CORS preflight
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    try:
        # Parse JSON body
        data = json.loads(request.body)
        id_token = data.get('idToken')  # Extract Firebase ID token

        # Verify token with Firebase
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']  # Get user's unique ID

        # Save user ID in session to maintain login state
        request.session['user_id'] = user_id

        # Respond with success
        return JsonResponse({
            'message': 'User registered successfully',
            'user_id': user_id
        })
    except Exception as e:
        # On error, return error message
        return JsonResponse({'error': str(e)}, status=400)

# Login API endpoint — expects POST or OPTIONS requests
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def login(request):
    # Handle CORS preflight
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    try:
        # Parse JSON body
        data = json.loads(request.body)
        id_token = data.get('idToken')  # Extract Firebase ID token

        # Verify token with Firebase
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']  # Get user's unique ID

        # Save user ID in session
        request.session['user_id'] = user_id

        # Respond with success
        return JsonResponse({
            'message': 'Login successful',
            'user_id': user_id
        })
    except Exception as e:
        # On error, return 401 Unauthorized
        return JsonResponse({'error': str(e)}, status=401)

# Logout API endpoint — clears the session
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def logout(request):
    # Handle CORS preflight
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    try:
        request.session.flush()  # Clear all session data
        return JsonResponse({'message': 'Logout successful'})  # Respond with success
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)  # On error

# Check if user is authenticated — returns True/False
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def check_auth(request):
    # Handle CORS preflight
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    # Check session for user_id
    user_id = request.session.get('user_id')
    if user_id:
        try:
            # Try fetching user from Firebase
            user = auth.get_user(user_id)
            return JsonResponse({
                'authenticated': True,
                'user_id': user_id,
                'email': user.email
            })
        except:
            # If user doesn't exist, clear session
            request.session.flush()
    
    # If not authenticated
    return JsonResponse({'authenticated': False})
