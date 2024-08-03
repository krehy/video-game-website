from wagtail import hooks
from wagtail.admin.viewsets.model import ModelViewSet
from .models import BlogPost, Game, Review, Developer, Publisher, Genre, Platform

class BlogPostAdminViewSet(ModelViewSet):
    model = BlogPost
    menu_label = "Blog Posts"
    menu_icon = "doc-full"
    add_to_admin_menu = True
    list_display = ["title", "intro"]
    search_fields = ["title", "intro", "body"]
    form_fields = ['title', 'intro', 'body', 'seo_title', 'search_description', 'main_image', 'slug']

class GameAdminViewSet(ModelViewSet):
    model = Game
    menu_label = "Games"
    menu_icon = "media"
    add_to_admin_menu = True
    list_display = ["title", "developer", "publisher"]
    search_fields = ["title", "developer", "publisher", "genres", "platforms"]
    form_fields = ['title', 'developer', 'publisher', 'genres', 'platforms', 'seo_title', 'search_description', 'slug']

class ReviewAdminViewSet(ModelViewSet):
    model = Review
    menu_label = "Reviews"
    menu_icon = "form"
    add_to_admin_menu = True
    list_display = ["title", "intro"]
    search_fields = ["title", "intro", "body"]
    form_fields = ['title', 'intro', 'body', 'seo_title', 'search_description', 'main_image', 'slug']

class DeveloperAdminViewSet(ModelViewSet):
    model = Developer
    menu_label = "Developers"
    menu_icon = "user"
    add_to_admin_menu = True
    list_display = ["name"]
    search_fields = ["name"]
    form_fields = ['name', 'slug']

class PublisherAdminViewSet(ModelViewSet):
    model = Publisher
    menu_label = "Publishers"
    menu_icon = "group"
    add_to_admin_menu = True
    list_display = ["name"]
    search_fields = ["name"]
    form_fields = ['name', 'slug']

class GenreAdminViewSet(ModelViewSet):
    model = Genre
    menu_label = "Genres"
    menu_icon = "tag"
    add_to_admin_menu = True
    list_display = ["name"]
    search_fields = ["name"]
    form_fields = ['name', 'slug']

class PlatformAdminViewSet(ModelViewSet):
    model = Platform
    menu_label = "Platforms"
    menu_icon = "site"
    add_to_admin_menu = True
    list_display = ["name"]
    search_fields = ["name"]
    form_fields = ['name', 'slug']

@hooks.register('register_admin_viewset')
def register_blog_post_admin_viewset():
    return BlogPostAdminViewSet('blog_post_admin_viewset')

@hooks.register('register_admin_viewset')
def register_game_admin_viewset():
    return GameAdminViewSet('game_admin_viewset')

@hooks.register('register_admin_viewset')
def register_review_admin_viewset():
    return ReviewAdminViewSet('review_admin_viewset')

@hooks.register('register_admin_viewset')
def register_developer_admin_viewset():
    return DeveloperAdminViewSet('developer_admin_viewset')

@hooks.register('register_admin_viewset')
def register_publisher_admin_viewset():
    return PublisherAdminViewSet('publisher_admin_viewset')

@hooks.register('register_admin_viewset')
def register_genre_admin_viewset():
    return GenreAdminViewSet('genre_admin_viewset')

@hooks.register('register_admin_viewset')
def register_platform_admin_viewset():
    return PlatformAdminViewSet('platform_admin_viewset')
