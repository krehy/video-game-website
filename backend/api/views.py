from django.views.decorators.csrf import csrf_exempt # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly # type: ignore
from rest_framework import viewsets # type: ignore
from .models import Aktualita, ContestEntry, BlogPost, Review, Game, BlogIndexPage, ReviewIndexPage, GameIndexPage, ProductIndexPage, HomePage, Comment, ArticleCategory
from .serializers import AktualitaSerializer, ContestEntrySerializer, HomePageContentSerializer,UserProfileSerializer, ContactMessageSerializer, BlogPostSerializer, ReviewSerializer, GameSerializer, BlogIndexPageSerializer, ReviewIndexPageSerializer, GameIndexPageSerializer, ProductIndexPageSerializer, HomePageSerializer, CommentSerializer, ArticleCategorySerializer
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
from django.contrib.auth import get_user_model # type: ignore

User = get_user_model()

class ContestEntryAPI(APIView):
    def post(self, request):
        print("Přijatá data:", request.data)  # Debugging
        serializer = ContestEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Odpověď byla úspěšně uložena!"}, status=status.HTTP_201_CREATED)
        print("Chyba:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_user_profile(request, username):
    try:
            user = User.objects.get(username__iexact=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserProfileSerializer(user, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def most_liked_article(request):
    """
    Returns the most liked article based on like_count.
    """
    most_liked = BlogPost.objects.order_by('-like_count').first()

    if not most_liked:
        return Response({'error': 'No articles found'}, status=status.HTTP_404_NOT_FOUND)

    response_data = {
        "id": most_liked.id,
        "title": most_liked.title,
        "slug": most_liked.slug,
        "first_published_at": most_liked.first_published_at,
        "like_count": most_liked.like_count,
        "read_count":most_liked.read_count,
        "main_image": {
            "id": most_liked.main_image.id,
            "url": most_liked.main_image.file.url
        } if most_liked.main_image else None,
        "owner": {
            "id": most_liked.owner.id,
            "username": most_liked.owner.username,
            "first_name": most_liked.owner.first_name,
            "last_name": most_liked.owner.last_name
        } if most_liked.owner else None,
        "categories": [{"id": cat.id, "name": cat.name} for cat in most_liked.categories.all()]
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def upcoming_games(request):
    """
    Returns 3 games with the closest release date.
    """
    upcoming_games = Game.objects.filter(release_date__gte=timezone.now()).order_by('release_date')[:3]
    
    game_data = []
    for game in upcoming_games:
        game_data.append({
            "id": game.id,
            "title": game.title,
            "slug": game.slug,
            "release_date": game.release_date,
            "main_image": game.main_image.file.url if game.main_image else None,
        })
    
    return Response(game_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def latest_posts(request):
    """
    Returns the 10 latest published blog posts, including the owner's information, categories, and properly formatted main image.
    """
    latest_posts = BlogPost.objects.live().select_related('owner', 'main_image').prefetch_related('categories').order_by('-first_published_at')[:5]
    
    post_data = []
    for post in latest_posts:
        owner_data = {
            "id": post.owner.id if post.owner else None,
            "username": post.owner.username if post.owner else "Unknown",
            "first_name": post.owner.first_name if post.owner else "",
            "last_name": post.owner.last_name if post.owner else ""
        }

        category_data = [{"id": category.id, "name": category.name} for category in post.categories.all()]

        main_image_data = {
            "id": post.main_image.id,
            "url": post.main_image.file.url
        } if post.main_image else None

        post_data.append({
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "intro": post.intro,
            "read_count": post.read_count,
            "first_published_at": post.first_published_at,
            "main_image": main_image_data,  # Správně formátovaný hlavní obrázek
            "owner": owner_data,  # Přidání ownera do odpovědi
            "categories": category_data  # Přidání kategorií do odpovědi
        })
    
    return Response(post_data, status=status.HTTP_200_OK)


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

@api_view(['GET'])
@permission_classes([AllowAny])
def esport_blogposts(request):
    """
    Vrací blogposty pouze s kategorií 'Esport'.
    """
    try:
        esport_category = ArticleCategory.objects.get(name__iexact="Esport")
        blogposts = BlogPost.objects.live().filter(categories=esport_category).distinct().order_by('-first_published_at')
        
        serializer = BlogPostSerializer(blogposts, many=True, context={"request": request})
        return Response(serializer.data, status=200)

    except ArticleCategory.DoesNotExist:
        return Response({"error": "Kategorie 'Esport' nebyla nalezena."}, status=404)
    
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


