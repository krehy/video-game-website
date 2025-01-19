from wagtail.models import Page
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.snippets.models import register_snippet
from wagtail.fields import RichTextField, StreamField
from wagtail.search import index
from modelcluster.fields import ParentalKey, ParentalManyToManyField
from wagtail.embeds.blocks import EmbedBlock
from wagtail.blocks import StructBlock, URLBlock
from wagtail.contrib.table_block.blocks import TableBlock

from django import forms
from django.db import models
from slugify import slugify
from django.core.files.storage import FileSystemStorage
from wagtail import blocks
from PIL import Image
from io import BytesIO
import os

@register_snippet
class Partner(models.Model):
    name = models.CharField(max_length=255, help_text="Název partnera")
    logo = models.ImageField(upload_to='partners/logos', help_text="Logo partnera")
    url = models.URLField(help_text="URL partnera")

    panels = [
        FieldPanel('name'),
        FieldPanel('logo'),
        FieldPanel('url'),
    ]

    def __str__(self):
        return self.name


class TwitterEmbedBlock(StructBlock):
    url = URLBlock(
        required=True,
        help_text="Vlož URL příspěvku z Twitteru/X (např. https://x.com/...)."
    )

    def get_tweet_id(self, url):
        # Extrahujeme tweet ID z URL
        if "twitter.com" in url or "x.com" in url:
            return url.split("/")[-1].split("?")[0]
        return None

    def get_api_representation(self, value, context=None):
        # Při exportu do JSON extrahujeme pouze tweet ID
        return {"tweet_id": self.get_tweet_id(value["url"])}

    class Meta:
        icon = "link"
        label = "Twitter Embed"


class AdBlock(blocks.StructBlock):
    zone_id = blocks.CharBlock(required=True, help_text="ID zóny pro reklamu")
    ad_width = blocks.IntegerBlock(required=True, help_text="Maximální šířka reklamy")
    ad_height = blocks.IntegerBlock(required=True, help_text="Maximální výška reklamy")

    def render(self, value, context=None):
        ad_html = f"""
        <div id="ssp-zone-{value['zone_id']}"></div>
        <script>
        sssp.getAds([
        {{
            "zoneId": {value['zone_id']},
            "id": "ssp-zone-{value['zone_id']}",
            "width": {value['ad_width']},
            "height": {value['ad_height']}
        }}
        ]);
        </script>
        """
        return ad_html

    class Meta:
        template = "blocks/ad_block.html"
        icon = "placeholder"
        label = "Ad Block"


def generate_slug(title):
    # Překlad českých klíčových slov do angličtiny
    translations = {
        "recenze": "reviews",
        "databaze-her": "games",
        # Přidejte další překlady podle potřeby
    }
    slug = slugify(title)
    return translations.get(slug, slug)

# Custom storage to handle WebP conversion
class WebPStorage(FileSystemStorage):
    def _save(self, name, content):
        # Získáme příponu souboru
        ext = os.path.splitext(name)[1].lower()
        
        # Pokud je obrázek v podporovaném formátu, zkomprimujeme a převedeme na WebP
        if ext in ['.jpg', '.jpeg', '.png', '.gif']:
            img = Image.open(content)
            output = BytesIO()
            img.save(output, format='WEBP', quality=85)  # kvalita komprese
            output.seek(0)

            name = os.path.splitext(name)[0] + '.webp'
            content = output

        return super()._save(name, content)

# Home Page model
class HomePage(Page):
    intro = models.CharField(max_length=250, default='')
    keywords = models.CharField(max_length=255, blank=True)
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    privacy_policy = RichTextField(blank=True, help_text="Zásady osobních údajů")
    terms_conditions = RichTextField(blank=True, help_text="Obchodní podmínky")
    about_us = RichTextField(blank=True, help_text="O nás")
    footer_text = RichTextField(blank=True, help_text="Text ve footeru")
    partners = ParentalManyToManyField('Partner', blank=True, related_name='homepages')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('main_image'),
        FieldPanel('privacy_policy'),
        FieldPanel('terms_conditions'),
        FieldPanel('about_us'),
        FieldPanel('footer_text'),
        FieldPanel('partners', widget=forms.CheckboxSelectMultiple),

    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('keywords'),
        FieldPanel('search_description'),
    ]

    subpage_types = ['BlogIndexPage', 'GameIndexPage', 'ProductIndexPage', 'ReviewIndexPage']

    @classmethod
    def is_creatable(cls):
        return False

    @classmethod
    def get_parent_page_types(cls):
        return []

    class Meta:
        verbose_name = "Home Page"
        verbose_name_plural = "Home Pages"

# SEO Fields (abstract model)
class SEOFields(models.Model):
    keywords = models.CharField(max_length=255, blank=True)

    class Meta:
        abstract = True

# Product Index Page model
class ProductIndexPage(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('main_image'),
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)


# Blog Index Page model
class BlogIndexPage(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('main_image'),
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    subpage_types = ['BlogPost']

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)

# Review Index Page model
class ReviewIndexPage(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('main_image'),
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    subpage_types = ['Review']

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)

# Game Index Page model
class GameIndexPage(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('main_image'),
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    subpage_types = ['Game']

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)

class SimpleAdvertisementBlock(blocks.StructBlock):
    class Meta:
        icon = "placeholder"
        label = "Advertisement"

    def get_context(self, value, parent_context=None):
        context = super().get_context(value, parent_context)
        # Přednastavené hodnoty
        context.update({
            'zone_id': 347254,
            'element_id': 'ssp-zone-347254',
            'width': 160,
            'height': 600,
        })
        return context


class BlogPost(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')
    body = StreamField([
        ('paragraph', blocks.RichTextBlock(required=True)),
        ('advertisement', SimpleAdvertisementBlock()),
    ('table', TableBlock(table_options={
        'minSpareRows': 1,  # Povolit přidávání řádků
        'minSpareCols': 1,  # Povolit přidávání sloupců
        'startRows': 3,  # Počáteční počet řádků
        'startCols': 3,  # Počáteční počet sloupců
    })),  # Přidání nastavení pro tabulky

    ], use_json_field=True, default='')
    active_users_count = models.IntegerField(default=0)
    read_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    linked_game = models.ForeignKey(
        'Game', on_delete=models.SET_NULL, null=True, blank=True, related_name='linked_blog_posts'
    )
    categories = ParentalManyToManyField('ArticleCategory', blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('body'),
        FieldPanel('main_image'),
        FieldPanel('read_count'),
        FieldPanel('like_count'),
        FieldPanel('dislike_count'),
        FieldPanel('linked_game'),
        FieldPanel('categories', widget=forms.CheckboxSelectMultiple),
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['BlogIndexPage']

    class Meta:
        ordering = ['-first_published_at']

class Game(Page, SEOFields, index.Indexed):
    description = RichTextField(default='')
    developer = models.ForeignKey(
        'Developer', on_delete=models.SET_NULL, null=True, blank=True, related_name='games'
    )
    publisher = models.ForeignKey(
        'Publisher', on_delete=models.SET_NULL, null=True, blank=True, related_name='games'
    )
    genres = ParentalManyToManyField('Genre', blank=True)
    platforms = ParentalManyToManyField('Platform', blank=True)
    release_date = models.DateField(null=True, blank=True)
    like_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    search_week = models.IntegerField(default=0)  # Nové pole pro počítání zobrazení v tomto týdnu
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    trailer_url = models.URLField(blank=True, null=True)

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('developer'),
        FieldPanel('publisher'),
        FieldPanel('genres', widget=forms.CheckboxSelectMultiple),
        FieldPanel('platforms', widget=forms.CheckboxSelectMultiple),
        FieldPanel('release_date'),
        FieldPanel('main_image'),
        FieldPanel('trailer_url'),
        FieldPanel('like_count'),
        FieldPanel('dislike_count'),
        FieldPanel('search_week'),  # Přidání pole do admin panelu
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['GameIndexPage']

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)

# Review Attribute model
class ReviewAttribute(models.Model):
    name = models.CharField(max_length=50)
    score = models.IntegerField(default=0)
    text = RichTextField(
        blank=True,
        null=True,
        features=['bold', 'italic', 'link', 'image', 'embed'],  # Povolené funkce, včetně obrázků
        help_text="Popis atributu s možností formátování a přidání obrázků"
    )
    review = ParentalKey('Review', on_delete=models.CASCADE, related_name='attributes')

    panels = [
        FieldPanel('name'),
        FieldPanel('score'),
        FieldPanel('text'),
    ]

# Pro model (for review pros)
class Pro(models.Model):
    review = ParentalKey('Review', on_delete=models.CASCADE, related_name='pros')
    text = models.CharField(max_length=255)

    panels = [
        FieldPanel('text'),
    ]

# Con model (for review cons)
class Con(models.Model):
    review = ParentalKey('Review', on_delete=models.CASCADE, related_name='cons')
    text = models.CharField(max_length=255)

    panels = [
        FieldPanel('text'),
    ]

# Review model
class Review(Page, SEOFields, index.Indexed):
    REVIEW_TYPES = [
        ('Game', 'Hra'),
        ('Keyboard', 'Klávesnice'),
        ('Mouse', 'Myš'),
        ('Monitor', 'Monitor'),
        ('Computer', 'Počítač'),
        ('Headphones', 'Sluchátka'),
        ('Console', 'Konzole'),
        ('Mobile', 'Mobil'),
        ('Notebook', 'Notebook'),
        ('Microphone', 'Mikrofon'),
    ]

    intro = models.CharField(max_length=250, default='')
    body = RichTextField(default='')
    read_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    linked_game = models.ForeignKey(
        'Game', on_delete=models.SET_NULL, null=True, blank=True, related_name='linked_reviews'
    )
    review_type = models.CharField(max_length=50, choices=REVIEW_TYPES, default='Game')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('body'),
        FieldPanel('main_image'),
        FieldPanel('read_count'),
        FieldPanel('linked_game'),
        FieldPanel('review_type'),
        FieldPanel('like_count'),
        FieldPanel('dislike_count'),
        InlinePanel('attributes', label="Attributes"),
        InlinePanel('pros', label="Klady"),
        InlinePanel('cons', label="Zápory"),
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['ReviewIndexPage']

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)

    def update_attributes(self):
        existing_attributes = set(self.attributes.values_list('name', flat=True))
        desired_attributes = set(self.ATTRIBUTE_CHOICES.get(self.review_type, []))
        attributes_to_create = desired_attributes - existing_attributes
        attributes_to_delete = existing_attributes - desired_attributes

        for attribute_name in attributes_to_create:
            ReviewAttribute.objects.create(name=attribute_name, review=self)

        for attribute_name in attributes_to_delete:
            self.attributes.filter(name=attribute_name).delete()

# Developer model (Snippet)
@register_snippet
class Developer(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

# Publisher model (Snippet)
@register_snippet
class Publisher(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

# Genre model (Snippet)
@register_snippet
class Genre(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

# Platform model (Snippet)
@register_snippet
class Platform(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

# Article Category model (Snippet)
@register_snippet
class ArticleCategory(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

# Comment model
class Comment(models.Model):
    page = models.ForeignKey(Page, related_name='comments', on_delete=models.CASCADE)
    author = models.CharField(max_length=255)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.author} on {self.page.title}"

# Contact Message model
class ContactMessage(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ('cooperation', 'Spolupráce'),
        ('problem', 'Nahlásit problém'),
        ('inquiry', 'Jiný dotaz'),
    ]

    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.get_message_type_display()} - {self.name}'

# Aktualita model
class Aktualita(models.Model):
    text = RichTextField(features=['bold', 'italic', 'link'], help_text="Text of the update with formatting options")
    is_active = models.BooleanField(default=True, help_text="If unchecked, this update will not be shown")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.text[:50]

    panels = [
        FieldPanel('text'),
        FieldPanel('is_active'),
    ]
