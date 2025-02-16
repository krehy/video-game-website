from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from .serializers import ContestEntrySerializer

class ContestEntryAPI(APIView):
    def post(self, request):
        serializer = ContestEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Odpověď byla úspěšně uložena!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
