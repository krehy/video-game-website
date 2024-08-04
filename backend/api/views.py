from rest_framework import viewsets
from .models import BlogPost, Review, Game, Product
from .serializers import BlogPostSerializer, ReviewSerializer, GameSerializer, ProductSerializer
from django.shortcuts import redirect

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

def home_redirect(request):
    return redirect('/cms')