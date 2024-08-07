from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .models import BlogPost, Review, Game, Product, BlogIndexPage, ReviewIndexPage, GameIndexPage, ProductIndexPage, HomePage, Comment, ArticleCategory
from .serializers import BlogPostSerializer, ReviewSerializer, GameSerializer, ProductSerializer, BlogIndexPageSerializer, ReviewIndexPageSerializer, GameIndexPageSerializer, ProductIndexPageSerializer, HomePageSerializer, CommentSerializer, ArticleCategorySerializer
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def increment_read_count(request, content_type, pk):
    model_map = {
        'article': BlogPost,
        'review': Review,
        'game': Game,
        'product': Product
    }

    model = model_map.get(content_type)
    if not model:
        return Response({'error': 'Invalid content type'}, status=400)

    content_object = get_object_or_404(model, pk=pk)
    content_object.read_count += 1
    content_object.save()
    return Response({'status': 'success', 'read_count': content_object.read_count})


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(live=True)
    serializer_class = BlogPostSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.prefetch_related('attributes').all()
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

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(is_approved=True)
    serializer_class = CommentSerializer

class ArticleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def like_article(request, pk):
    try:
        article = BlogPost.objects.get(pk=pk)
        article.like_count += 1
        article.save()
        return Response({'status': 'success', 'like_count': article.like_count}, status=status.HTTP_200_OK)
    except BlogPost.DoesNotExist:
        return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def dislike_article(request, pk):
    try:
        article = BlogPost.objects.get(pk=pk)
        article.dislike_count += 1
        article.save()
        return Response({'status': 'success', 'dislike_count': article.dislike_count}, status=status.HTTP_200_OK)
    except BlogPost.DoesNotExist:
        return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def like_review(request, pk):
    try:
        review = Review.objects.get(pk=pk)
        review.like_count += 1
        review.save()
        return Response({'status': 'success', 'like_count': review.like_count}, status=status.HTTP_200_OK)
    except Review.DoesNotExist:
        return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def dislike_review(request, pk):
    try:
        review = Review.objects.get(pk=pk)
        review.dislike_count += 1
        review.save()
        return Response({'status': 'success', 'dislike_count': review.dislike_count}, status=status.HTTP_200_OK)
    except Review.DoesNotExist:
        return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def like_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        product.like_count += 1
        product.save()
        return Response({'status': 'success', 'like_count': product.like_count}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def dislike_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        product.dislike_count += 1
        product.save()
        return Response({'status': 'success', 'dislike_count': product.dislike_count}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def like_game(request, pk):
    try:
        game = Game.objects.get(pk=pk)
        game.like_count += 1
        game.save()
        return Response({'status': 'success', 'like_count': game.like_count}, status=status.HTTP_200_OK)
    except Game.DoesNotExist:
        return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def dislike_game(request, pk):
    try:
        game = Game.objects.get(pk=pk)
        game.dislike_count += 1
        game.save()
        return Response({'status': 'success', 'dislike_count': game.dislike_count}, status=status.HTTP_200_OK)
    except Game.DoesNotExist:
        return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

def home_redirect(request):
    return redirect('/cms')
