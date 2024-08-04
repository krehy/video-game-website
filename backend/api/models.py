from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel
from wagtail.snippets.models import register_snippet
from wagtail.fields import RichTextField
from wagtail.search import index
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel

class HomePage(Page):
    intro = models.CharField(max_length=250, default='')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    subpage_types = ['BlogIndexPage', 'GameIndexPage', 'ProductIndexPage', 'ReviewIndexPage']

    @classmethod
    def is_creatable(cls):
        return False

    @classmethod
    def get_parent_page_types(cls):
        return []

class SEOFields(models.Model):
    keywords = models.CharField(max_length=255, blank=True)

    class Meta:
        abstract = True

class BlogIndexPage(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    promote_panels = [
        FieldPanel('slug'),
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    subpage_types = ['BlogPost']

class ReviewIndexPage(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    promote_panels = [
        FieldPanel('slug'),
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    subpage_types = ['Review']

class GameIndexPage(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    promote_panels = [
        FieldPanel('slug'),
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    subpage_types = ['Game']

class ProductIndexPage(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    promote_panels = [
        FieldPanel('slug'),
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    subpage_types = ['Product']

class BlogPost(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')
    body = RichTextField(default='')
    read_count = models.IntegerField(default=0)
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    linked_game = models.ForeignKey(
        'Game', on_delete=models.SET_NULL, null=True, blank=True, related_name='blog_posts'
    )
    linked_product = models.ForeignKey(
        'Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='blog_posts'
    )
    categories = models.ManyToManyField('ArticleCategory', blank=True, related_name='blog_posts')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('body'),
        FieldPanel('main_image'),
        FieldPanel('read_count'),
        FieldPanel('linked_game'),
        FieldPanel('linked_product'),
        FieldPanel('categories'),
    ]

    promote_panels = [
        FieldPanel('slug'),
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['BlogIndexPage']

class Game(Page, SEOFields, index.Indexed):
    description = RichTextField(default='')
    developer = models.ForeignKey(
        'Developer', on_delete=models.SET_NULL, null=True, blank=True, related_name='games'
    )
    publisher = models.ForeignKey(
        'Publisher', on_delete=models.SET_NULL, null=True, blank=True, related_name='games'
    )
    genres = models.ManyToManyField('Genre', blank=True, related_name='games')
    platforms = models.ManyToManyField('Platform', blank=True, related_name='games')

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('developer'),
        FieldPanel('publisher'),
        FieldPanel('genres'),
        FieldPanel('platforms'),
    ]

    promote_panels = [
        FieldPanel('slug'),
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['GameIndexPage']

class Review(Page, SEOFields, index.Indexed):
    intro = models.CharField(max_length=250, default='')
    body = RichTextField(default='')
    read_count = models.IntegerField(default=0)
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    linked_game = models.ForeignKey(
        'Game', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews'
    )
    linked_product = models.ForeignKey(
        'Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews'
    )

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('body'),
        FieldPanel('main_image'),
        FieldPanel('read_count'),
        FieldPanel('linked_game'),
        FieldPanel('linked_product'),
    ]

    promote_panels = [
        FieldPanel('slug'),
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['ReviewIndexPage']

class Product(Page, SEOFields, index.Indexed):
    PHYSICAL = 'physical'
    DIGITAL = 'digital'
    AFFILIATE = 'affiliate'

    PRODUCT_TYPE_CHOICES = [
        (PHYSICAL, 'Physical Product'),
        (DIGITAL, 'Digital Product'),
        (AFFILIATE, 'Affiliate Product'),
    ]

    description = RichTextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    product_type = models.CharField(
        max_length=10,
        choices=PRODUCT_TYPE_CHOICES,
        default=PHYSICAL,
    )
    linked_games = models.ManyToManyField('Game', blank=True, related_name='products')
    categories = models.ManyToManyField('ProductCategory', blank=True, related_name='products')

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('price'),
        FieldPanel('stock'),
        FieldPanel('main_image'),
        FieldPanel('product_type'),
        FieldPanel('linked_games'),
        FieldPanel('categories'),
    ]

    promote_panels = [
        FieldPanel('slug'),
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['ProductIndexPage']

@register_snippet
class Developer(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

@register_snippet
class Publisher(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

@register_snippet
class Genre(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

@register_snippet
class Platform(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

@register_snippet
class ArticleCategory(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

@register_snippet
class ProductCategory(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name
