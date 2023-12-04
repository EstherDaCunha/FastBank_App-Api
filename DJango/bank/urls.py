
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from api.views import CustomTokenObtainPairView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='api-docs'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/autenticacao/', CustomTokenObtainPairView.as_view(), name='autenticacao'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
