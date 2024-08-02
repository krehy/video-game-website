# Video Game Website Project

Welcome to the Video Game Website Project! This project aims to create a comprehensive platform for video game enthusiasts. It includes a blog, advanced review system, e-commerce functionalities, user forums, and social features.

## Features

- **Blog**: Manageable categories, tagging, commenting, and rating.
- **Game Reviews**: Advanced review system for games and hardware.
- **User Authentication**: Secure login with JWT tokens and 2FA.
- **Permissions System**: Role-based access control.
- **E-commerce**: Support for physical, digital, affiliate, and dropshipping products.
- **Forums**: Robust discussion boards with user respect system.
- **Social Features**: User profiles, friend requests, private messaging, activity feeds.
- **SEO Optimization**: JSON-LD, dynamic sitemaps, Open Graph, and Twitter Cards.
- **Performance**: Redis caching, CDN integration, lazy loading, and more.
- **Security**: HTTPS, CSRF protection, XSS prevention, and SQL injection protection.

## Technologies

- **Front-end**: Next.js, Tailwind CSS, TypeScript
- **Back-end**: Django, Django REST Framework, PostgreSQL, Redis, Django Allauth, Wagtail CMS
- **Communication**: Axios
- **CI/CD**: GitHub Actions, Docker

## Project Structure

**Front-end (Next.js + TypeScript)**:
├── public
├── src
│ ├── components
│ ├── pages
│ ├── styles
│ ├── utils
│ ├── hooks
│ ├── context
│ ├── services
│ ├── types
│ ├── constants
│ └── tests
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
└── README.md
**Back-end (Django + Django REST Framework)**:
├── config
│ ├── settings.py
│ ├── urls.py
│ └── wsgi.py
├── apps
│ ├── core
│ │ ├── models.py
│ │ ├── views.py
│ │ ├── serializers.py
│ │ ├── urls.py
│ │ └── tests.py
├── static
├── templates
├── media
├── manage.py
├── requirements.txt
└── README.md
## Getting Started

### Prerequisites

- Node.js
- Python 3.8+
- PostgreSQL
- Redis
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
git clone https://github.com/krehy/video-game-website.git
cd video-game-website
2. Install front-end dependencies:
cd frontend
npm install
3. Install back-end dependencies:
cd backend
pip install -r requirements.txt
4. Configure environment variables:
- Create a `.env` file in the `backend` and `frontend` directories and add your environment-specific variables.

### Running the Project

1. Start the PostgreSQL and Redis servers.

2. Run the Django development server:
cd backend
python manage.py runserver


3. Run the Next.js development server:
cd frontend
npm run dev
4. Open your browser and go to `http://localhost:3000` to see the application.

## Contributing

Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

## License

This project is licensed under the MIT License.
