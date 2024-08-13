from wagtail.models import Page
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.snippets.models import register_snippet
from wagtail.fields import RichTextField
from wagtail.search import index
from modelcluster.fields import ParentalKey, ParentalManyToManyField
from modelcluster.models import ClusterableModel
from django import forms
from django.db import models
from slugify import slugify

# Utility function to generate slugs
def generate_slug(title):
    return slugify(title)

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

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('main_image'),
        FieldPanel('privacy_policy'),
        FieldPanel('terms_conditions'),
        FieldPanel('about_us'),
        FieldPanel('footer_text'),
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

    subpage_types = ['Product']

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)

# Blog Post model
class BlogPost(Page, SEOFields, index.Indexed):
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
        'Game', on_delete=models.SET_NULL, null=True, blank=True, related_name='linked_blog_posts'
    )
    linked_product = models.ForeignKey(
        'Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='blog_posts'
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
        FieldPanel('linked_product'),
        FieldPanel('categories', widget=forms.CheckboxSelectMultiple),
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['BlogIndexPage']

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)

# Game model
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
    text = models.TextField(blank=True, null=True)
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
    linked_product = models.ForeignKey(
        'Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews'
    )
    review_type = models.CharField(max_length=50, choices=REVIEW_TYPES, default='Game')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('body'),
        FieldPanel('main_image'),
        FieldPanel('read_count'),
        FieldPanel('linked_game'),
        FieldPanel('linked_product'),
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

# Product Image model
class ProductImage(models.Model):
    product = ParentalKey('Product', related_name='images', on_delete=models.CASCADE)
    image = models.ForeignKey(
        'wagtailimages.Image',
        on_delete=models.CASCADE,
        related_name='+'
    )

    panels = [
        FieldPanel('image'),
    ]

    def __str__(self):
        return f"Image for {self.product.title}"

# Product model
class Product(Page, SEOFields, index.Indexed):
    description = RichTextField()
    like_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    main_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    linked_games = ParentalManyToManyField('Game', blank=True)
    categories = ParentalManyToManyField('ProductCategory', blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('description'),
        FieldPanel('main_image'),
        InlinePanel('images', label="Additional Images"),
        FieldPanel('linked_games', widget=forms.CheckboxSelectMultiple),
        FieldPanel('categories', widget=forms.CheckboxSelectMultiple),
        FieldPanel('like_count'),
        FieldPanel('dislike_count'),
        InlinePanel('product_variants', label="Product Variants"),
    ]

    promote_panels = [
        FieldPanel('seo_title'),
        FieldPanel('search_description'),
        FieldPanel('keywords'),
    ]

    parent_page_types = ['ProductIndexPage']

    def save(self, *args, **kwargs):
        self.slug = generate_slug(self.slug)
        super().save(*args, **kwargs)

# Product Variant model
class ProductVariant(models.Model):
    FORMAT_CHOICES = [
        ('digital', 'Digital'),
        ('physical', 'Physical'),
    ]

    product = ParentalKey('Product', related_name='product_variants', on_delete=models.CASCADE)
    platform = models.ForeignKey('Platform', null=True, blank=True, on_delete=models.SET_NULL)
    size = models.ForeignKey('ClothingSize', null=True, blank=True, on_delete=models.SET_NULL)
    color = models.ForeignKey('ClothingColor', null=True, blank=True, on_delete=models.SET_NULL)
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='physical')
    stock = models.IntegerField(default=0)
    price = models.IntegerField()  # Moved to ProductVariant model

    panels = [
        FieldPanel('platform'),
        FieldPanel('size'),
        FieldPanel('color'),
        FieldPanel('format'),
        FieldPanel('stock'),
        FieldPanel('price'),
    ]

    def __str__(self):
        return f"Variant of {self.product.title}"

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

# Product Category model (Snippet)
@register_snippet
class ProductCategory(models.Model):
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

# Clothing Size model (Snippet)
@register_snippet
class ClothingSize(models.Model):
    SIZE_CHOICES = [
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
    ]
    name = models.CharField(max_length=5, choices=SIZE_CHOICES)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

# Clothing Color model (Snippet)
@register_snippet
class ClothingColor(models.Model):
    name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7)

    panels = [
        FieldPanel('name'),
        FieldPanel('hex_code'),
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
