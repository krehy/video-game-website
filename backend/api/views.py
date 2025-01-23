from django.views.decorators.csrf import csrf_exempt # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly # type: ignore
from rest_framework import viewsets # type: ignore
from .models import Aktualita, BlogPost, Review, Game, BlogIndexPage, ReviewIndexPage, GameIndexPage, ProductIndexPage, HomePage, Comment, ArticleCategory
from .serializers import AktualitaSerializer, HomePageContentSerializer, ContactMessageSerializer, BlogPostSerializer, ReviewSerializer, GameSerializer, BlogIndexPageSerializer, ReviewIndexPageSerializer, GameIndexPageSerializer, ProductIndexPageSerializer, HomePageSerializer, CommentSerializer, ArticleCategorySerializer
from django.http import JsonResponse # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from django.shortcuts import redirect # type: ignore
from django.shortcuts import get_object_or_404 # type: ignore
from django.utils import timezone # type: ignore
import logging

import redis # type: ignore

from wagtail.images.models import Image # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.permissions import AllowAny # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

@api_view(['GET'])
@permission_classes([AllowAny])
def get_image_url(request, image_id):
    """
    API endpoint to fetch the URL of an image based on its ID.
    """
    try:
        image = Image.objects.get(id=image_id)
        return Response({'url': image.file.url}, status=status.HTTP_200_OK)
    except Image.DoesNotExist:
        return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)


# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=1)

def get_content_model(content_type):
    if content_type == 'article':
        return BlogPost
    elif content_type == 'review':
        return Review
    else:
        return None

def get_top_most_read(request, content_type):
    model = get_content_model(content_type)
    if model is None:
        return JsonResponse({"error": "Invalid content type"}, status=400)

    top_content = model.objects.all()

    content_data = []

    for content in top_content:
        key = f"active_users:{content_type}:{content.id}"
        active_users = r.get(key)
        active_users_count = int(active_users) if active_users else 0
        
        content_data.append({
            'id': content.id,
            'title': content.title,
            'slug': content.slug,
            'read_count': content.read_count,
            'active_users': active_users_count,
            'content_type': content_type,  # Add content_type to the response

        })

    # Seřadit obsah podle počtu aktivních uživatelů v sestupném pořadí
    content_data_sorted = sorted(content_data, key=lambda x: x['active_users'], reverse=True)

    # Vrátit pouze tři záznamy s největším počtem aktivních uživatelů
    top_three_content = content_data_sorted[:3]

    return JsonResponse(top_three_content, safe=False)


def get_active_users(request, content_type, content_id):
    key = f"active_users:{content_type}:{content_id}"
    active_users = r.get(key)
    active_users_count = int(active_users) if active_users else 0
    return JsonResponse({"active_users": active_users_count})

def increment_active_users(request, content_type, content_id):
    key = f"active_users:{content_type}:{content_id}"
    current_count = r.incr(key)
    
    # Zajistit, že hodnota je vždy alespoň 1 po zvýšení
    if current_count is None or int(current_count) < 1:
        r.set(key, 1)
        current_count = 1
    
    return JsonResponse({"active_users": int(current_count)})

def decrement_active_users(request, content_type, content_id):
    key = f"active_users:{content_type}:{content_id}"
    current_count = r.get(key)
    
    if current_count and int(current_count) > 0:
        r.decr(key)
    else:
        r.set(key, 0)
    
    active_users = r.get(key)
    return JsonResponse({"active_users": int(active_users)})


@csrf_exempt
def increment_search_week(request, game_id):
    if request.method == 'POST':
        try:
            game = Game.objects.get(pk=game_id)
            logger.info(f"Found game: {game}")
            game.search_week += 1
            game.save()
            logger.info(f"Successfully incremented search_week for game: {game_id}")
            return JsonResponse({'status': 'success', 'search_week': game.search_week})
        except Game.DoesNotExist:
            logger.error(f"Game with id {game_id} does not exist.")
            return JsonResponse({'status': 'error', 'message': 'Game not found'}, status=404)
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return JsonResponse({'status': 'error', 'message': 'An internal error occurred'}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

def most_searched_game_of_week(request):
    try:
        most_searched_game = Game.objects.order_by('-search_week').first()
        if most_searched_game:
            main_image_url = None
            if most_searched_game.main_image:
                # Získáme URL k obrázku, včetně domény, pokud je dostupná
                main_image_url = most_searched_game.main_image.get_rendition('original').url
            
            return JsonResponse({
                'id': most_searched_game.id,
                'title': most_searched_game.title,
                'description': most_searched_game.description,
                'slug': most_searched_game.slug,
                'search_week': most_searched_game.search_week,
                'main_image': {
                    'url': main_image_url
                },
                'release_date': most_searched_game.release_date,
            })
        return JsonResponse({'error': 'No games found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

class AktualitaViewSet(viewsets.ModelViewSet):
    queryset = Aktualita.objects.filter(is_active=True)
    serializer_class = AktualitaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def increment_read_count(request, content_type, pk):
    model_map = {
        'article': BlogPost,
        'review': Review,
        'game': Game,
    }

    model = model_map.get(content_type)
    if not model:
        return Response({'error': 'Invalid content type'}, status=400)

    content_object = get_object_or_404(model, pk=pk)
    content_object.read_count += 1
    content_object.save()
    return Response({'status': 'success', 'read_count': content_object.read_count})

class ContactMessageView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': 'Zpráva byla úspěšně odeslána.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.prefetch_related('attributes').all()
    serializer_class = ReviewSerializer

logger = logging.getLogger(__name__)

@csrf_exempt
def increment_search_week(request, game_id):
    if request.method == 'POST':
        try:
            game = Game.objects.get(pk=game_id)
            logger.info(f"Incrementing search_week for game: {game_id}")
            game.search_week += 1
            game.save()
            return JsonResponse({'status': 'success', 'search_week': game.search_week})
        except Game.DoesNotExist:
            logger.error(f"Game with id {game_id} does not exist.")
            return JsonResponse({'status': 'error', 'message': 'Game not found'}, status=404)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)
6.
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.prefetch_related('linked_blog_posts', 'linked_reviews').filter(live=True)
    serializer_class = GameSerializer
    lookup_field = 'pk'  # Změněno z 'slug' na 'pk'
    
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

class HomePageContentView(APIView):
    def get(self, request, *args, **kwargs):
        homepage = HomePage.objects.live().first()
        if homepage:
            serializer = HomePageContentSerializer(homepage)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "HomePage not found"}, status=status.HTTP_404_NOT_FOUND)

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


