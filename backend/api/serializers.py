import re
from rest_framework import serializers # type: ignore
from wagtail.images.models import Image # type: ignore
from bs4 import BeautifulSoup # type: ignore
from django.contrib.auth import get_user_model # type: ignore
from wagtail.users.models import UserProfile # type: ignore
from .models import ContestEntry

User = get_user_model()



from .models import (
    Aktualita, Pro, Con, ContactMessage, BlogPost, Review,
    ReviewAttribute, Game, ArticleCategory, Genre, Platform,
    Developer, Publisher, BlogIndexPage, ReviewIndexPage,
    GameIndexPage, ProductIndexPage, HomePage, Comment, Partner
)

class ContestEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestEntry
        fields = ["name", "email", "phone", "answers"]


class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    latest_posts = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()  # Přidání pole groups

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "profile_image", "latest_posts", "groups"]

    def get_profile_image(self, obj):
        request = self.context.get("request")
        try:
            user_profile = UserProfile.objects.get(user=obj)
            if user_profile.avatar and hasattr(user_profile.avatar, 'url'):
                return request.build_absolute_uri(user_profile.avatar.url)
        except UserProfile.DoesNotExist:
            pass
        return None

    def get_groups(self, obj):
        excluded_groups = {"Editor", "Moderator"}  # Skupiny, které chceme vyloučit
        return [group for group in obj.groups.values_list("name", flat=True) if group not in excluded_groups]

    def get_latest_posts(self, obj):
        latest_blog_posts = BlogPost.objects.filter(owner=obj, live=True).order_by("-first_published_at")[:5]
        latest_reviews = Review.objects.filter(owner=obj, live=True).order_by("-first_published_at")[:5]
        
        all_posts = list(latest_blog_posts) + list(latest_reviews)
        all_posts.sort(key=lambda post: post.first_published_at, reverse=True)  # Seřazení podle data publikace

        return [
            {
                "id": post.id,
                "title": post.title,
                "slug": post.slug,
                "intro": post.intro,
                "read_count": post.read_count,
                "published_at": post.first_published_at,
                "main_image": self.get_main_image_url(post),
                "type": "review" if isinstance(post, Review) else "blog",
            }
            for post in all_posts[:10]  # Vracíme maximálně 10 článků a recenzí dohromady
        ]

    def get_main_image_url(self, post):
        """ Pomocná metoda na získání URL hlavního obrázku článku/recenze """
        request = self.context.get("request")
        if post.main_image:
            return request.build_absolute_uri(post.main_image.file.url)
        return None


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
    enriched_body = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()  # Přidáme vlastní pole pro `main_image`
    categories = serializers.SerializerMethodField()  # Přidáme vlastní pole pro kategorie
    owner = serializers.SerializerMethodField()  # Přidáme vlastní pole pro owner
    url_path = serializers.SerializerMethodField()  # Přidáme vlastní pole pro úpravu url_path

    class Meta:
        model = BlogPost
        fields = '__all__'  # Zachová všechna pole z modelu BlogPost + enriched_body, main_image, categories, owner a url_path

    def get_url_path(self, obj):
        # Úprava url_path odstraněním slova "superpařmeni"
        return re.sub(r'/superpa[řr]meni', '', obj.url_path)

    def get_enriched_body(self, obj):
        body_content = []
    
        for block in obj.body:  # Iterujeme přes StreamField obsah
            if block.block_type == 'paragraph':
                enriched_value = self.replace_embed_with_url(block.value)
                body_content.append(enriched_value)

            elif block.block_type == 'advertisement':  
                ad_data = block.value.get("advertisement")
                if ad_data:
                    body_content.append({
                        "type": "advertisement",
                        "id": ad_data.id,
                        "title": ad_data.title,
                        "image": ad_data.image.file.url if ad_data.image else None,
                        "link": ad_data.link,
                        "click_count": ad_data.click_count,
                    })
        
            elif block.block_type == 'table':
                body_content.append(block.value)  # Tabulky ponecháme ve stávajícím formátu
        
            else:
                body_content.append(str(block.value))  # Ostatní hodnoty necháme jako string
    
        return body_content

    def replace_embed_with_url(self, value):
        # Implementace pro manipulaci s HTML
        if hasattr(value, 'source'):
            value = value.source
        soup = BeautifulSoup(value, 'html.parser')
        for embed_tag in soup.find_all('embed', {'embedtype': 'image'}):
            image_id = embed_tag.get('id')
            try:
                image = Image.objects.get(pk=image_id)
                embed_tag.replace_with(f'<img src="{image.file.url}" alt="{embed_tag.get("alt", "")}" />')
            except Image.DoesNotExist:
                embed_tag.replace_with('[Image not found]')
        return str(soup)

    def get_main_image(self, obj):
        # Vrátí objekt s `id` a `url` pro main_image
        if obj.main_image:
            return {
                "id": obj.main_image.id,
                "url": obj.main_image.file.url
            }
        return None

    def get_categories(self, obj):
        # Vrací seznam kategorií ve formátu s id a name
        return [{"id": category.id, "name": category.name} for category in obj.categories.all()]

    def get_owner(self, obj):
        # Vrací informace o ownerovi
        owner = obj.owner
        if owner:
            return {
                "id": owner.id,
                "username": owner.username,
                "first_name": owner.first_name,
                "last_name": owner.last_name,
            }
        return None


class ReviewAttributeSerializer(serializers.ModelSerializer):
    enriched_text = serializers.SerializerMethodField()

    class Meta:
        model = ReviewAttribute
        fields = ['name', 'score', 'text', 'enriched_text']

    def get_enriched_text(self, obj):
        return self.enrich_text(obj.text)

    def enrich_text(self, value):
        # Zpracování HTML obsahu a náhrada embed tagů
        if hasattr(value, 'source'):
            value = value.source
        soup = BeautifulSoup(value, 'html.parser')
        for embed_tag in soup.find_all('embed', {'embedtype': 'image'}):
            image_id = embed_tag.get('id')
            try:
                image = Image.objects.get(pk=image_id)
                embed_tag.replace_with(f'<img src="{image.file.url}" alt="{embed_tag.get("alt", "")}" />')
            except Image.DoesNotExist:
                embed_tag.replace_with('[Image not found]')
        for embed_tag in soup.find_all('embed', {'embedtype': 'media'}):
            embed_url = embed_tag.get('url')
            if embed_url and 'youtube.com' in embed_url:
                video_id = embed_url.split('v=')[-1]
                embed_tag.replace_with(
                    f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" '
                    f'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                )
        return str(soup)

class ProSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pro
        fields = ['text']

class ConSerializer(serializers.ModelSerializer):
    class Meta:
        model = Con
        fields = ['text']

class ReviewSerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField()
    enriched_body = serializers.SerializerMethodField()
    attributes = ReviewAttributeSerializer(many=True, read_only=True)
    pros = ProSerializer(many=True, read_only=True)
    cons = ConSerializer(many=True, read_only=True)
    url_path = serializers.SerializerMethodField()  # Přidáme vlastní pole pro úpravu url_path
    owner = serializers.SerializerMethodField()  # Přidáme vlastní pole pro owner

    class Meta:
        model = Review
        fields = '__all__'

    def get_url_path(self, obj):
        # Úprava url_path odstraněním slova "superpařmeni"
        return obj.url_path.replace('/superpařmeni', '')

    def get_main_image(self, obj):
        if obj.main_image:
            return {
                "id": obj.main_image.id,
                "url": obj.main_image.file.url
            }
        return None

    def get_enriched_body(self, obj):
        if hasattr(obj.body, 'source'):
            body_content = obj.body.source
        else:
            body_content = obj.body
        return self.enrich_text(body_content)

    def enrich_text(self, value):
        soup = BeautifulSoup(value, 'html.parser')
        for embed_tag in soup.find_all('embed', {'embedtype': 'image'}):
            image_id = embed_tag.get('id')
            try:
                image = Image.objects.get(pk=image_id)
                embed_tag.replace_with(f'<img src="{image.file.url}" alt="{embed_tag.get("alt", "")}" />')
            except Image.DoesNotExist:
                embed_tag.replace_with('[Image not found]')
        for embed_tag in soup.find_all('embed', {'embedtype': 'media'}):
            embed_url = embed_tag.get('url')
            if embed_url and 'youtube.com' in embed_url:
                video_id = embed_url.split('v=')[-1]
                embed_tag.replace_with(
                    f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" '
                    f'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                )
        return str(soup)

    def get_owner(self, obj):
        # Vrací informace o ownerovi stejným způsobem jako v BlogPostSerializer
        owner = obj.owner
        if owner:
            return {
                "id": owner.id,
                "username": owner.username,
                "first_name": owner.first_name,
                "last_name": owner.last_name,
            }
        return None


class GameSerializer(serializers.ModelSerializer):
    main_image = ImageSerializer(read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    platforms = PlatformSerializer(many=True, read_only=True)
    developer = DeveloperSerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True)
    linked_blog_posts = BlogPostSerializer(many=True, read_only=True)
    linked_reviews = ReviewSerializer(many=True, read_only=True)
    enriched_description = serializers.SerializerMethodField()
    url_path = serializers.SerializerMethodField()  # Přidáme vlastní pole pro úpravu url_path

    class Meta:
        model = Game
        fields = '__all__'

    def get_url_path(self, obj):
        # Úprava url_path odstraněním slova "superpařmeni"
        return obj.url_path.replace('/superpařmeni', '')

    def get_enriched_description(self, obj):
        def process_embed_tags(value):
            soup = BeautifulSoup(value, 'html.parser')
            for embed_tag in soup.find_all('embed', {'embedtype': 'image'}):
                image_id = embed_tag.get('id')
                try:
                    image = Image.objects.get(pk=image_id)
                    img_tag = soup.new_tag('img', src=image.file.url, alt=embed_tag.get('alt', ''))
                    embed_tag.replace_with(img_tag)
                except Image.DoesNotExist:
                    embed_tag.replace_with('[Image not found]')
            for embed_tag in soup.find_all('embed', {'embedtype': 'media'}):
                media_url = embed_tag.get('url')
                if media_url:
                    if "youtube.com" in media_url or "youtu.be" in media_url:
                        if "youtube.com" in media_url:
                            video_id = media_url.split('v=')[-1].split('&')[0]
                        elif "youtu.be" in media_url:
                            video_id = media_url.split('/')[-1]
                        iframe_tag = soup.new_tag('iframe', src=f'https://www.youtube.com/embed/{video_id}')
                        iframe_tag.attrs = {
                            'width': '560',
                            'height': '315',
                            'frameborder': '0',
                            'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                            'allowfullscreen': True
                        }
                        embed_tag.replace_with(iframe_tag)
                    else:
                        embed_tag.replace_with(f'[Unsupported media: {media_url}]')
            return str(soup)

        return process_embed_tags(obj.description) if obj.description else None

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

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['name', 'logo', 'url']

class HomePageContentSerializer(serializers.ModelSerializer):
    partners = serializers.SerializerMethodField()

    class Meta:
        model = HomePage
        fields = ['about_us', 'footer_text', 'privacy_policy', 'partners']

    def get_partners(self, obj):
        partners = Partner.objects.all()
        return [
            {
                "name": partner.name,
                "logo": partner.logo.url,
                "url": partner.url
            }
            for partner in partners
        ]

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['message_type', 'name', 'email', 'message']
