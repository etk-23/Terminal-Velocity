import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Build base paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent           # points to /backend/core
FRONTEND_DIR = BASE_DIR.parent / 'frontend'                 # points to /frontend (sibling of /backend)


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-your-secret-key'  # Secret key for cryptographic operations

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']   # Allow all hosts for development

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',                                 # Admin panel
    'django.contrib.auth',                                  # Authentication framework
    'django.contrib.contenttypes',                          # Content type framework
    'django.contrib.sessions',                              # Session support
    'django.contrib.messages',                              # Messaging framework
    'django.contrib.staticfiles',                           # Serve static files
    'corsheaders',                                          # CORS support
    'authentication.apps.AuthenticationConfig',             # Your custom auth app
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',                # Handle CORS
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',            # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'authentication.middleware.FirebaseAuthenticationMiddleware',  # Custom Firebase Auth middleware
]

ROOT_URLCONF = 'core.urls'                                  # Root URL config

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [FRONTEND_DIR],                             # Serve frontend HTML from this directory
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',         # SQLite for simplicity
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    FRONTEND_DIR,                   # Load static files (CSS/JS) from /frontend
]

# Remove STATIC_ROOT since we're not using collectstatic
# STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True  # Changed back to True for development    # Allow all origins in development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [        # Explicitly allow local dev origins
    "http://localhost:8001",
    "http://127.0.0.1:8001",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]
CORS_ALLOW_METHODS = [            # Allow standard HTTP methods
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [          # Allow these headers in requests
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# CSRF settings
CSRF_TRUSTED_ORIGINS = [            # Trust localhost/127.0.0.1 for CSRF
    "http://localhost:8001",
    "http://127.0.0.1:8001",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

# Session settings
SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # Use database for sessions
SESSION_COOKIE_AGE = 1209600  # Sessions last 2 weeks
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_DOMAIN = None  # Allow cookies on localhost / local sessions

# Firebase Admin Configuration
FIREBASE_ADMIN_CREDENTIALS = {
    "type": os.getenv("FIREBASE_ADMIN_TYPE"),
    "project_id": os.getenv("FIREBASE_ADMIN_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_ADMIN_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_ADMIN_PRIVATE_KEY"),
    "client_email": os.getenv("FIREBASE_ADMIN_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_ADMIN_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_ADMIN_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_ADMIN_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_ADMIN_CLIENT_X509_CERT_URL")
} 