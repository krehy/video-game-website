from django.contrib.syndication.views import Feed # type: ignore
from .models import BlogPost, Review


class BlogPostFeed(Feed):
    title = "Blog Posts Feed"
    link = "/rss/blog/"
    description = "Updates on new blog posts."

    def items(self):
        return BlogPost.objects.live().order_by('-first_published_at')[:500]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.intro

    def item_link(self, item):
        return f"https://superparmeni.eu/blog/{item.slug}"

    def item_pubdate(self, item):
        """ Přidání správného <pubDate> """
        return item.first_published_at

    def item_enclosure_url(self, item):
        """ Vrátí URL obrázku v požadovaném rozměru (800x450 px) """
        if item.main_image:
            try:
                # Vygeneruje obrázek v rozměru 800x450 px
                rendition = item.main_image.get_rendition("fill-800x450")
                return f"https://superparmeni.eu{rendition.url}"
            except Exception as e:
                print(f"Chyba při generování obrázku: {e}")  # Logování chyby
                return f"https://superparmeni.eu{item.main_image.file.url}"  # Fallback na původní obrázek
        return None

    def item_enclosure_length(self, item):
        """ Odhad velikosti obrázku (můžeš upravit podle potřeby) """
        return "300000" if item.main_image else None

    def item_enclosure_mime_type(self, item):
        """ Nastavení MIME typu obrázku """
        return "image/jpeg" if item.main_image else None


class ReviewFeed(Feed):
    title = "Reviews Feed"
    link = "/rss/reviews/"
    description = "Updates on new reviews."

    def items(self):
        return Review.objects.live().order_by('-first_published_at')[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.intro

    def item_link(self, item):
        # Assuming your Next.js app handles review detail pages at this route
        return f'http://localhost:3000/reviews/{item.slug}'
