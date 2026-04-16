from django.urls import path
from . import views, auth_views

urlpatterns = [
    # Auth Endpoints
    path('auth/register/', auth_views.register_user, name='register'),
    path('auth/login/', auth_views.login_user, name='login'),
    path('auth/profile/', auth_views.get_user_profile, name='profile'),
    path('auth/profile/update/', auth_views.update_user_profile, name='profile_update'),
    path('auth/password/reset/', auth_views.change_password, name='password_reset'),
    
    # Data & Analysis Endpoints
    path('upload-data/', views.upload_data, name='upload_data'),
    path('posts/', views.get_posts, name='get_posts'),
    path('analyze/', views.analyze_sentiment_view, name='analyze_sentiment'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('trends/', views.sentiment_trends, name='sentiment_trends'),
    path('themes/', views.get_themes, name='get_themes'),
    path('bulk-analyze/', views.bulk_analyze, name='bulk_analyze'),
    path('insights/', views.get_insights_view, name='get_insights'),
]
