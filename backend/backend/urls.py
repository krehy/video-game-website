from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    increment_read_count,
    BlogPostViewSet, ReviewViewSet, GameViewSet, ProductViewSet,
    BlogIndexPageViewSet, ReviewIndexPageViewSet, GameIndexPageViewSet, CommentViewSet,
    ProductIndexPageViewSet, HomePageViewSet, ArticleCategoryViewSet,
    like_article, dislike_article, like_review, dislike_review, like_product, dislike_product, like_game, dislike_game
)
from wagtail.contrib.sitemaps.views import sitemap
from django.shortcuts import redirect
from api.feeds import BlogPostFeed, ReviewFeed
from django.conf.urls.static import static
from django.conf import settings

def home_redirect(request):
    return redirect('/cms/')

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'games', GameViewSet)
router.register(r'products', ProductViewSet)
router.register(r'blogindex', BlogIndexPageViewSet)
router.register(r'reviewindex', ReviewIndexPageViewSet)
router.register(r'gameindex', GameIndexPageViewSet)
router.register(r'productindex', ProductIndexPageViewSet)
router.register(r'homepage', HomePageViewSet)
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'categories', ArticleCategoryViewSet, basename='categories')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('cms/', include('wagtail.admin.urls')),
    path('documents/', include('wagtail.documents.urls')),
    path('sitemap.xml', sitemap),
    path('rss/blog/', BlogPostFeed(), name='blogpost_feed'),
    path('rss/reviews/', ReviewFeed(), name='review_feed'),
    path('api/posts/<int:pk>/like/', like_article, name='like_article'),
    path('api/posts/<int:pk>/dislike/', dislike_article, name='dislike_article'),
    path('api/reviews/<int:pk>/like/', like_review, name='like_review'),
    path('api/reviews/<int:pk>/dislike/', dislike_review, name='dislike_review'),
    path('api/products/<int:pk>/like/', like_product, name='like_product'),
    path('api/products/<int:pk>/dislike/', dislike_product, name='dislike_product'),
    path('api/games/<int:pk>/like/', like_game, name='like_game'),
    path('api/games/<int:pk>/dislike/', dislike_game, name='dislike_game'),
    path('api/increment-read-count/<str:content_type>/<int:pk>/', increment_read_count, name='increment-read-count'),
    path('', home_redirect),
    path('', include('wagtail.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
