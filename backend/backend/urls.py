from django.contrib import admin
from django.urls import path, include
from wagtail.admin import urls as wagtailadmin_urls
from rest_framework.routers import DefaultRouter
from api.views import BlogPostViewSet, ReviewViewSet, GameViewSet
from wagtail.contrib.sitemaps.views import sitemap
from django.shortcuts import redirect
from wagtail.contrib.sitemaps.sitemap_generator import Sitemap

# Funkce pro přesměrování na CMS
def home_redirect(request):
    return redirect('/cms/')

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'games', GameViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('cms/', include(wagtailadmin_urls)),
    path('sitemap.xml', sitemap),
    path('', home_redirect),  # Přesměrování hlavní URL na CMS
    path('', include('wagtail.urls')),  # Ujistěte se, že toto je přítomno
]
