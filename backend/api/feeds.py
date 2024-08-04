from django.contrib.syndication.views import Feed
from .models import BlogPost, Review

class BlogPostFeed(Feed):
    title = "Blog Posts Feed"
    link = "/rss/blog/"
    description = "Updates on new blog posts."

    def items(self):
        return BlogPost.objects.live().order_by('-first_published_at')[:10]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.intro

    def item_link(self, item):
        # Assuming your Next.js app handles blog post detail pages at this route
        return f'http://localhost:3000/blog/{item.slug}'

class ReviewFeed(Feed):
    title = "Reviews Feed"
    link = "/rss/reviews/"
    description = "Updates on new reviews."

    def items(self):
        return Review.objects.live().order_by('-first_published_at')[:10]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.intro

    def item_link(self, item):
        # Assuming your Next.js app handles review detail pages at this route
        return f'http://localhost:3000/reviews/{item.slug}'
