from wagtail_modeladmin.options import ModelAdmin, ModelAdminGroup, modeladmin_register # type: ignore
from wagtail.snippets.views.snippets import SnippetViewSet # type: ignore
from .models import Partner, ContestEntry, Aktualita, ContactMessage, Developer, Publisher, Genre, Platform, BlogPost, Game, Review, ArticleCategory, Comment

class ContestEntryAdmin(ModelAdmin):
    model = ContestEntry
    menu_label = "Soutěžní přihlášky"
    menu_icon = "form"
    list_display = ("name", "email", "phone", "submitted_at")
    search_fields = ("name", "email")
    ordering = ("-submitted_at",)

modeladmin_register(ContestEntryAdmin)


class AktualitaAdmin(ModelAdmin):
    model = Aktualita
    menu_label = 'Aktuality'
    menu_icon = 'list-ul'
    list_display = ('text', 'is_active', 'created_at', 'updated_at')
    search_fields = ('text',)
    list_filter = ('is_active', 'created_at')

class DeveloperAdmin(ModelAdmin):
    model = Developer
    menu_label = 'Developers'
    menu_icon = 'user'
    list_display = ('name',)
    search_fields = ('name',)

class PublisherAdmin(ModelAdmin):
    model = Publisher
    menu_label = 'Publishers'
    menu_icon = 'group'
    list_display = ('name',)
    search_fields = ('name',)

class GenreAdmin(ModelAdmin):
    model = Genre
    menu_label = 'Genres'
    menu_icon = 'tag'
    list_display = ('name',)
    search_fields = ('name',)

class PlatformAdmin(ModelAdmin):
    model = Platform
    menu_label = 'Platforms'
    menu_icon = 'desktop'
    list_display = ('name',)
    search_fields = ('name',)

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


class CommentAdmin(ModelAdmin):
    model = Comment
    menu_label = 'Komentáře'
    menu_icon = 'pilcrow'
    list_display = ('author', 'text', 'page', 'created_at', 'is_approved')
    search_fields = ('author', 'text')
    list_filter = ('is_approved',)
    
class PartnerAdmin(ModelAdmin):
    model = Partner
    menu_label = "Partneři"
    menu_icon = "group"  # Ikona pro partnery
    list_display = ("name", "url")  # Zobrazí se sloupce jméno a URL
    search_fields = ("name",)

class ContentAdminGroup(ModelAdminGroup):
    menu_label = "Obsah webu"
    menu_icon = "folder-open-inverse"
    items = (AktualitaAdmin, BlogPostAdmin, GameAdmin, ReviewAdmin, CommentAdmin, PartnerAdmin)

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

class PartnerViewSet(SnippetViewSet):
    model = Partner
    menu_label = "Partneři"
    icon = "group"  # Ikona pro partnery
    add_to_admin_menu = True  # Zobrazit v menu adminu
    menu_order = 200  # Pořadí v menu


modeladmin_register(ContactMessageAdmin)

modeladmin_register(DeveloperAdmin)
modeladmin_register(PublisherAdmin)
modeladmin_register(GenreAdmin)
modeladmin_register(PlatformAdmin)
