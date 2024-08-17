from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ( get_top_most_read, increment_search_week, most_searched_game_of_week,
    increment_active_users, decrement_active_users, get_active_users,
    increment_read_count, ContactMessageView, HomePageContentView,
    BlogPostViewSet, ReviewViewSet, GameViewSet,
    BlogIndexPageViewSet, ReviewIndexPageViewSet, GameIndexPageViewSet, CommentViewSet,
    ProductIndexPageViewSet, HomePageViewSet, ArticleCategoryViewSet, AktualitaViewSet,
    like_article, dislike_article, like_review, dislike_review, like_game, dislike_game
)
from wagtail.contrib.sitemaps.views import sitemap
from django.shortcuts import redirect
from api.feeds import BlogPostFeed, ReviewFeed
from django.conf.urls.static import static
from django.conf import settings

def home_redirect(request):
    return redirect('/cms/')

# Initialize the router and register the viewsets
router = DefaultRouter()
router.register(r'posts', BlogPostViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'games', GameViewSet)
router.register(r'blogindex', BlogIndexPageViewSet)
router.register(r'reviewindex', ReviewIndexPageViewSet)
router.register(r'gameindex', GameIndexPageViewSet)
router.register(r'productindex', ProductIndexPageViewSet)
router.register(r'homepage', HomePageViewSet)
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'categories', ArticleCategoryViewSet, basename='categories')
router.register(r'aktuality', AktualitaViewSet, basename='aktuality')  # Register the Aktualita viewset

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('cms/', include('wagtail.admin.urls')),
    path('documents/', include('wagtail.documents.urls')),
    path('sitemap.xml', sitemap),
    path('api/most-searched-game-week/', most_searched_game_of_week, name='most_searched_game_of_week'),

    path('rss/blog/', BlogPostFeed(), name='blogpost_feed'),
    path('rss/reviews/', ReviewFeed(), name='review_feed'),
    path('api/posts/<int:pk>/like/', like_article, name='like_article'),
    path('api/posts/<int:pk>/dislike/', dislike_article, name='dislike_article'),
    path('api/reviews/<int:pk>/like/', like_review, name='like_review'),
    path('api/reviews/<int:pk>/dislike/', dislike_review, name='dislike_review'),
    path('api/games/<int:pk>/like/', like_game, name='like_game'),
    path('api/games/<int:pk>/dislike/', dislike_game, name='dislike_game'),
    path('api/increment-read-count/<str:content_type>/<int:pk>/', increment_read_count, name='increment-read-count'),
    path('api/contact_message/', ContactMessageView.as_view(), name='contact_message'),
    path('api/homepage-content/', HomePageContentView.as_view(), name='homepage-content'),
    path('', home_redirect),
    path('api/active-users/<str:content_type>/<int:content_id>/', get_active_users, name='get_active_users'),
    path('api/increment-active-users/<str:content_type>/<int:content_id>/', increment_active_users, name='increment_active_users'),
    path('api/decrement-active-users/<str:content_type>/<int:content_id>/', decrement_active_users, name='decrement_active_users'),
    path('api/top-most-read/<str:content_type>/', get_top_most_read, name='top_most_read'),
    path('api/increment-search-week/<int:game_id>/', increment_search_week, name='increment_search_week'),

    path('', include('wagtail.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
