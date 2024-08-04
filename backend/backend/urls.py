from django.contrib import admin
from django.urls import path, include
from wagtail.admin import urls as wagtailadmin_urls
from rest_framework.routers import DefaultRouter
from api.views import BlogPostViewSet, ReviewViewSet, GameViewSet, ProductViewSet
from wagtail.contrib.sitemaps.views import sitemap
from django.shortcuts import redirect
from wagtail.contrib.sitemaps.sitemap_generator import Sitemap
from api.feeds import BlogPostFeed, ReviewFeed

# Function for redirecting to CMS
def home_redirect(request):
    return redirect('/cms/')

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'games', GameViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('cms/', include(wagtailadmin_urls)),
    path('documents/', include('wagtail.documents.urls')),
    path('sitemap.xml', sitemap),
    path('rss/blog/', BlogPostFeed(), name='blogpost_feed'),  # RSS feed for blog posts
    path('rss/reviews/', ReviewFeed(), name='review_feed'),  # RSS feed for reviews
    path('', home_redirect),

    path('', include('wagtail.urls')),  # Wagtail URLs should be included last
]
