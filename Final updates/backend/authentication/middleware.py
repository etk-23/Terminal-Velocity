### RESPONSE HANDLING

# Import JsonResponse to return JSON responses from Django views
from django.http import JsonResponse

# Import Firebase admin SDK tools
from firebase_admin import auth, credentials, initialize_app
import firebase_admin

# Import Django settings to access FIREBASE_ADMIN_CREDENTIALS
from django.conf import settings

# 🔧 Function to initialize Firebase app
def initialize_firebase():
    try:
        # If Firebase is already initialized, return the existing app
        return firebase_admin.get_app()
    except ValueError:
        try:
            # Get credentials dictionary from Django settings
            creds_dict = settings.FIREBASE_ADMIN_CREDENTIALS
            
            # Replace escaped newlines in private key (fixes formatting issue)
            if 'private_key' in creds_dict:
                creds_dict['private_key'] = creds_dict['private_key'].replace('\\n', '\n')
            
            # Create Firebase credential from dict
            cred = credentials.Certificate(creds_dict)
            # Initialize Firebase app using the credentials
            return initialize_app(cred)
        except Exception as e:
            # Print error if Firebase fails to initialize
            print(f"Failed to initialize Firebase: {str(e)}")
            return None

# ⚡ Initialize Firebase once when this file is loaded
firebase_app = initialize_firebase()

# 🔐 Middleware class to protect API routes using Firebase authentication
class FirebaseAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response  # Django will call this after middleware
        self.firebase_initialized = firebase_app is not None  # Track if Firebase started properly

    # This function runs on every request
    def __call__(self, request):
        # ✅ Allow requests that don’t need auth (public/static routes)
        if not request.path.startswith('/api/') or \
           request.path.startswith('/api/auth/signup/') or \
           request.path.startswith('/api/auth/login/') or \
           request.path.startswith('/api/auth/check-auth/') or \
           request.path.startswith('/static/') or \
           request.path == '/':
            return self.get_response(request)

        # ❌ If Firebase is not initialized properly, block the request
        if not self.firebase_initialized:
            return JsonResponse({
                'error': 'Firebase authentication is not properly configured'
            }, status=503)

        try:
            # 🔍 Get user session ID (set after login/signup)
            session_id = request.session.get('user_id')
            if not session_id:
                # If no session ID, user is not logged in
                return JsonResponse({'error': 'Authentication required'}, status=401)

            # 🔎 Check if user still exists in Firebase
            try:
                user = auth.get_user(session_id)
                # Attach user data to request for future use
                request.user_id = user.uid
                request.user_email = user.email
            except:
                # If user no longer exists, clear session and return error
                request.session.flush()
                return JsonResponse({'error': 'Invalid session'}, status=401)

        except Exception as e:
            # Handle any unexpected error during auth check
            return JsonResponse({'error': str(e)}, status=401)

        # ✅ If all checks pass, continue with the normal view
        return self.get_response(request)
