from django.core.files.storage import FileSystemStorage
from PIL import Image
from io import BytesIO
import os

class WebPStorage(FileSystemStorage):
    def _save(self, name, content):
        # Získáme příponu souboru
        ext = os.path.splitext(name)[1].lower()
        
        # Pokud je obrázek v podporovaném formátu, zkomprimujeme a převedeme na WebP
        if ext in ['.jpg', '.jpeg', '.png', '.gif']:
            img = Image.open(content)
            output = BytesIO()
            img.save(output, format='WEBP', quality=85)  # kvalita komprese
            output.seek(0)

            name = os.path.splitext(name)[0] + '.webp'
            content = output

        return super()._save(name, content)
