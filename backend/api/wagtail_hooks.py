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

@hooks.register('construct_main_menu')
def add_games_menu_item(request, menu_items):
    menu_items.append(
        MenuItem(
            'Games',
            '/admin/games/',
            classnames='icon icon-fa-gamepad',  # Použijte ikonu Font Awesome nebo jinou
            order=10000  # Nastavte pořadí, pokud je potřeba
        )
    )
