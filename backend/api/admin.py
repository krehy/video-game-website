from wagtail_modeladmin.options import ModelAdmin, ModelAdminGroup, modeladmin_register
from .models import ContactMessage, Developer, Publisher, Genre, Platform, BlogPost, Game, Review, Product, ArticleCategory, ProductCategory, Comment, ProductVariant

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

class ProductVariantAdmin(ModelAdmin):
    model = ProductVariant
    menu_label = 'Varianty produktů'
    menu_icon = 'tag'
    list_display = ('product', 'platform', 'size', 'color', 'price', 'stock')
    search_fields = ('product__title',)

class ProductAdmin(ModelAdmin):
    model = Product
    menu_label = 'Produkty'
    menu_icon = 'tag'
    list_display = ('title',)
    search_fields = ('title', 'description')

modeladmin_register(ProductAdmin)
modeladmin_register(ProductVariantAdmin)

class CommentAdmin(ModelAdmin):
    model = Comment
    menu_label = 'Komentáře'
    menu_icon = 'pilcrow'
    list_display = ('author', 'text', 'page', 'created_at', 'is_approved')
    search_fields = ('author', 'text')
    list_filter = ('is_approved',)

class ContentAdminGroup(ModelAdminGroup):
    menu_label = 'Obsah webu'
    menu_icon = 'folder-open-inverse'
    items = (BlogPostAdmin, GameAdmin, ReviewAdmin, ProductAdmin, ProductVariantAdmin, CommentAdmin)

modeladmin_register(ContentAdminGroup)

class ContactMessageAdmin(ModelAdmin):
    model = ContactMessage
    menu_label = "Zprávy"
    menu_icon = "mail"
    menu_order = 100
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ("message_type", "name", "email", "created_at")
    search_fields = ("name", "email", "message")

modeladmin_register(ContactMessageAdmin)
