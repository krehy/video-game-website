from wagtail_modeladmin.options import ModelAdmin, ModelAdminGroup, modeladmin_register
from .models import Developer, Publisher, Genre, Platform, BlogPost, Game, Review

class DeveloperAdmin(ModelAdmin):
    model = Developer
    menu_label = 'Developers'
    menu_icon = 'user'
    list_display = ('name',)
    search_fields = ('name',)

modeladmin_register(DeveloperAdmin)

class PublisherAdmin(ModelAdmin):
    model = Publisher
    menu_label = 'Publishers'
    menu_icon = 'group'
    list_display = ('name',)
    search_fields = ('name',)

modeladmin_register(PublisherAdmin)

class GenreAdmin(ModelAdmin):
    model = Genre
    menu_label = 'Genres'
    menu_icon = 'tag'
    list_display = ('name',)
    search_fields = ('name',)

modeladmin_register(GenreAdmin)

class PlatformAdmin(ModelAdmin):
    model = Platform
    menu_label = 'Platforms'
    menu_icon = 'desktop'
    list_display = ('name',)
    search_fields = ('name',)

modeladmin_register(PlatformAdmin)

class BlogPostAdmin(ModelAdmin):
    model = BlogPost
    menu_label = 'Články'
    menu_icon = 'doc-full'
    list_display = ('title', 'intro', 'read_count')
    search_fields = ('title', 'intro')

class GameAdmin(ModelAdmin):
    model = Game
    menu_label = 'Hry'
    menu_icon = 'media'
    list_display = ('title', 'description', 'developer', 'publisher')
    search_fields = ('title', 'description')

class ReviewAdmin(ModelAdmin):
    model = Review
    menu_label = 'Recenze'
    menu_icon = 'edit'
    list_display = ('title', 'intro', 'read_count')
    search_fields = ('title', 'intro')

class ContentAdminGroup(ModelAdminGroup):
    menu_label = 'Obsah webu'
    menu_icon = 'folder-open-inverse'  # Ikona pro hlavní položku menu
    items = (BlogPostAdmin, GameAdmin, ReviewAdmin)

modeladmin_register(ContentAdminGroup)
