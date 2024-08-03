from wagtail.snippets.views.snippets import SnippetViewSet
from django.utils.translation import gettext_lazy as _

class CustomSnippetViewSet(SnippetViewSet):
    icon = 'snippet'
    menu_label = _('Obsah webu')
    add_to_admin_menu = True
    index_template_name = 'wagtailadmin/generic/index.html'
    add_template_name = 'wagtailadmin/generic/create.html'
    edit_template_name = 'wagtailadmin/generic/edit.html'
    history_template_name = 'wagtailadmin/generic/history.html'
