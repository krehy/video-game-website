from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Aktualita, Pro, Con, ContactMessage, BlogPost, Review,
    ReviewAttribute, Game, ArticleCategory, Genre, Platform,
    Developer, Publisher, BlogIndexPage, ReviewIndexPage,
    GameIndexPage, ProductIndexPage, HomePage, Comment
)
from wagtail.images.models import Image

class AktualitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aktualita
        fields = ['id', 'text', 'created_at']


class ImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ('id', 'url')

    def get_url(self, obj):
        return obj.file.url

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')

class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        fields = ('id', 'name')

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name')

class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ('id', 'name')

class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ('id', 'name')

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ('id', 'name')

class BlogPostSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)
    categories = ArticleCategorySerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = '__all__'

class ReviewAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewAttribute
        fields = ['name', 'score', 'text']

class ProSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pro
        fields = ['text']

class ConSerializer(serializers.ModelSerializer):
    class Meta:
        model = Con
        fields = ['text']

class ReviewSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)
    categories = ArticleCategorySerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)
    attributes = ReviewAttributeSerializer(many=True, read_only=True)
    pros = ProSerializer(many=True, read_only=True)
    cons = ConSerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = '__all__'

class GameSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    platforms = PlatformSerializer(many=True, read_only=True)
    developer = DeveloperSerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True)
    linked_blog_posts = BlogPostSerializer(many=True, read_only=True)
    linked_reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = '__all__'

class BlogIndexPageSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)

    class Meta:
        model = BlogIndexPage
        fields = ('id', 'intro', 'seo_title', 'search_description', 'keywords', 'main_image')

class ReviewIndexPageSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)

    class Meta:
        model = ReviewIndexPage
        fields = ('id', 'intro', 'seo_title', 'search_description', 'keywords', 'main_image')

class GameIndexPageSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)

    class Meta:
        model = GameIndexPage
        fields = ('id', 'intro', 'seo_title', 'search_description', 'keywords', 'main_image')

class ProductIndexPageSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)

    class Meta:
        model = ProductIndexPage
        fields = ('id', 'intro', 'seo_title', 'search_description', 'keywords', 'main_image')

class HomePageSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)

    class Meta:
        model = HomePage
        fields = ('id', 'seo_title', 'search_description', 'keywords', 'main_image')

class HomePageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        fields = ['about_us', 'footer_text', 'privacy_policy']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['message_type', 'name', 'email', 'message']
