from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Aktualita,
    ProductImage, Pro, Con, ContactMessage, BlogPost, Review,
    ReviewAttribute, Game, Product, ArticleCategory, Genre, Platform,
    ProductCategory, Developer, Publisher, BlogIndexPage, ReviewIndexPage,
    GameIndexPage, ProductIndexPage, HomePage, Comment, ProductVariant,
    ClothingSize, ClothingColor
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

class ClothingSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingSize
        fields = ('id', 'name')

class ClothingColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingColor
        fields = ('id', 'name', 'hex_code')

class ProductVariantSerializer(serializers.ModelSerializer):
    platform = PlatformSerializer(read_only=True)
    size = ClothingSizeSerializer(read_only=True)
    color = ClothingColorSerializer(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ('id', 'platform', 'size', 'color', 'format', 'stock', 'price')

class ProductImageSerializer(serializers.ModelSerializer):
    image = ImageSerializer(read_only=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ('id', 'name')

class ProductSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)
    categories = ProductCategorySerializer(many=True, read_only=True)
    images = ProductImageSerializer(source='images.all', many=True, read_only=True)
    product_variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

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
