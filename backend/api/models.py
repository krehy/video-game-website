from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from wagtail.snippets.models import register_snippet
from wagtail.fields import RichTextField

class BlogIndexPage(Page):
    intro = models.CharField(max_length=250, default='')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    subpage_types = ['BlogPost']

class ReviewIndexPage(Page):
    intro = models.CharField(max_length=250, default='')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    subpage_types = ['Review']

class GameIndexPage(Page):
    intro = models.CharField(max_length=250, default='')

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    subpage_types = ['Game']

class BlogPost(Page):
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

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('body'),
        FieldPanel('main_image'),
        FieldPanel('read_count'),
    ]

    parent_page_types = ['BlogIndexPage']

class Game(Page):
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

    parent_page_types = ['GameIndexPage']

class Review(Page):
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

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('body'),
        FieldPanel('main_image'),
        FieldPanel('read_count'),
    ]

    parent_page_types = ['ReviewIndexPage']

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
