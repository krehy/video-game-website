from wagtail import hooks
from wagtail.admin.menu import MenuItem

@hooks.register('construct_main_menu')
def hide_snippets_from_main_menu(request, menu_items):
    # Remove snippet-related menu items by name
    menu_items[:] = [item for item in menu_items if item.name not in [
        'developers', 'publishers', 'genres', 'platforms'
    ]]

@hooks.register('construct_main_menu')
def rename_snippets_menu(request, menu_items):
    for item in menu_items:
        if item.name == 'snippets':
            item.label = 'Databáze'  # Replace 'Custom Snippets' with the desired label
