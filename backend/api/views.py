from rest_framework import generics
from .models import BlogPage
from .serializers import BlogPageSerializer

class BlogPageList(generics.ListAPIView):
    queryset = BlogPage.objects.all()
    serializer_class = BlogPageSerializer
