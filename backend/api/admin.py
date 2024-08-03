from wagtail_modeladmin.options import ModelAdmin, modeladmin_register
from .models import Developer, Publisher, Genre, Platform, BlogPost, Game, Review

class DeveloperAdmin(ModelAdmin):
    model = Developer
    menu_label = 'Developers'
    menu_icon = 'user'  # Specifikujte název ikony
    list_display = ('name',)
    search_fields = ('name',)

modeladmin_register(DeveloperAdmin)

class PublisherAdmin(ModelAdmin):
    model = Publisher
    menu_label = 'Publishers'
    menu_icon = 'group'  # Specifikujte název ikony
    list_display = ('name',)
    search_fields = ('name',)

modeladmin_register(PublisherAdmin)

class GenreAdmin(ModelAdmin):
    model = Genre
    menu_label = 'Genres'
    menu_icon = 'tag'  # Specifikujte název ikony
    list_display = ('name',)
    search_fields = ('name',)

modeladmin_register(GenreAdmin)

class PlatformAdmin(ModelAdmin):
    model = Platform
    menu_label = 'Platforms'
    menu_icon = 'desktop'  # Specifikujte název ikony
    list_display = ('name',)
    search_fields = ('name',)

modeladmin_register(PlatformAdmin)

class BlogPostAdmin(ModelAdmin):
    model = BlogPost
    menu_label = 'Blog Posts'
    menu_icon = 'doc-full'  # Specifikujte název ikony
    list_display = ('title', 'intro', 'read_count')
    search_fields = ('title', 'intro')

modeladmin_register(BlogPostAdmin)

class GameAdmin(ModelAdmin):
    model = Game
    menu_label = 'Games'
    menu_icon = 'game'  # Specifikujte název ikony
    list_display = ('title', 'description', 'developer', 'publisher')
    search_fields = ('title', 'description')

modeladmin_register(GameAdmin)

class ReviewAdmin(ModelAdmin):
    model = Review
    menu_label = 'Reviews'
    menu_icon = 'edit'  # Specifikujte název ikony
    list_display = ('title', 'intro', 'read_count')
    search_fields = ('title', 'intro')

modeladmin_register(ReviewAdmin)
