from django.contrib.auth.models import User
from rest_framework import serializers
from .models import BlogPost, Review, ReviewAttribute, Pro, Con, Game, Product, ArticleCategory, Genre, Platform, ProductCategory, Developer, Publisher, BlogIndexPage, ReviewIndexPage, GameIndexPage, ProductIndexPage, HomePage, Comment
from wagtail.images.models import Image

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

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
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
        fields = ['id', 'text']

class ConSerializer(serializers.ModelSerializer):
    class Meta:
        model = Con
        fields = ['id', 'text']

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

    class Meta:
        model = Game
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)
    categories = ProductCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Product
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

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
