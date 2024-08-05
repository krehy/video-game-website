from rest_framework import viewsets
from .models import BlogPost, Review, Game, Product, BlogIndexPage, ReviewIndexPage, GameIndexPage, ProductIndexPage, HomePage
from .serializers import BlogPostSerializer, ReviewSerializer, GameSerializer, ProductSerializer, BlogIndexPageSerializer, ReviewIndexPageSerializer, GameIndexPageSerializer, ProductIndexPageSerializer, HomePageSerializer
from django.shortcuts import redirect

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(live=True)
    serializer_class = BlogPostSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(live=True)
    serializer_class = ReviewSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.filter(live=True)
    serializer_class = GameSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(live=True)
    serializer_class = ProductSerializer

class BlogIndexPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogIndexPage.objects.all()
    serializer_class = BlogIndexPageSerializer

class ReviewIndexPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ReviewIndexPage.objects.all()
    serializer_class = ReviewIndexPageSerializer

class GameIndexPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GameIndexPage.objects.all()
    serializer_class = GameIndexPageSerializer

class ProductIndexPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductIndexPage.objects.all()
    serializer_class = ProductIndexPageSerializer

class HomePageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HomePage.objects.all()
    serializer_class = HomePageSerializer

def home_redirect(request):
    return redirect('/cms')
