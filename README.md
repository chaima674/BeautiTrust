\# BeautiTrust



BeautiTrust is a Django-based beauty aggregation platform that centralizes beauty spots (salons, spas), products, and services into a single system. It allows users to browse listings, book services, purchase products, manage their cart and wishlist, and leave reviews. The platform also includes a personalization system based on user preferences and advice responses.



The project is built primarily using Django templates, enhanced with an internal JSON API layer for dynamic features, and is fully containerized using Docker and PostgreSQL.



\---



\## Features



\### User Features

\- User registration and login (session-based authentication)

\- Browse beauty spots with services, ratings, and details

\- Browse beauty products with categories and pricing

\- View detailed pages for spots and products

\- Add items (products, services, and beauty spots) to cart

\- Wishlist system for saving favorites

\- Leave reviews for beauty spots and products

\- Submit feedback messages

\- Personalized beauty advice system (question \& answer)

\- Save user preferences for personalization



\---



\### System Features

\- Django template-based web application (server-rendered UI)

\- Internal JSON API for dynamic interactions (cart, wishlist, reviews)

\- Transaction system with commission calculation (10%)

\- Category-based product organization

\- Session-based authentication system

\- Django template + API + session-based interaction design



\---



\## Tech Stack



\- Backend: Django

\- Database: PostgreSQL

\- Frontend: Django Templates (HTML, CSS, JavaScript)

\- Authentication: Session-based authentication

\- Containerization: Docker, Docker Compose



\---



\## System Architecture



BeautiTrust is built as a monolithic Django application with an internal API layer to support dynamic functionality.



```

Browser

&#x20;  ↓

Django Views (Templates + API endpoints)

&#x20;  ↓

PostgreSQL Database

```



\- Templates handle UI rendering

\- API endpoints handle dynamic actions (AJAX-style requests)

\- Sessions manage user authentication and personalization data



\---



\## Core Modules



\### Authentication System

\- Custom User model

\- Email-based login

\- Password hashing using Django utilities

\- Session-based authentication (no JWT)



\### Marketplace System

\- Beauty spots (salons, spas, providers)

\- Products with categories

\- Services linked to beauty spots



\### User Interaction System

\- Cart system (supports products, services, and beauty spots)

\- Wishlist system

\- Review system (spots + products)

\- Feedback submission system



\### Personalization System

\- Advice Q\&A system

\- User preference storage (session + database)



\### Transaction System

\- Purchase and booking handling

\- Commission calculation (10%)

\- Transaction tracking per user



\---



\## API Overview



The project includes internal JSON APIs for dynamic features:



\### Spots \& Products

\- `GET /api/spots/` → List all beauty spots

\- `GET /api/products/` → List all products

\- `GET /api/spot/<id>/` → Spot details with services and reviews

\- `GET /api/product/<id>/` → Product details with reviews



\### Cart \& Wishlist

\- `POST /api/add-to-cart/` → Add item to cart

\- `GET /api/get-user-cart/` → Retrieve user cart

\- `POST /api/remove-cart-item/` → Remove item from cart

\- `POST /api/add-to-wishlist/` → Add item to wishlist

\- `GET /api/get-user-wishlist/` → Get wishlist items



\### Reviews \& Feedback

\- `POST /api/add-review/` → Add beauty spot review

\- `POST /api/add-product-review/` → Add product review

\- `POST /api/add-feedback/` → Submit feedback



\### Personalization

\- `POST /api/save-advice-response/` → Save advice answers

\- `POST /api/save-user-preference/` → Save preferences



\### Transactions

\- `POST /api/create-transaction/` → Create purchase or booking transaction



\---



\## Frontend Pages



\- Landing page

\- Home page (personalized using session data)

\- Login page

\- Registration page

\- Beauty spot detail page

\- Product detail page



All pages are rendered using Django templates.



\---



\## Docker Setup



\### Prerequisites

\- Docker

\- Docker Compose



\---



\### Run the project



```bash

docker compose up --build

```



Run in background:



```bash

docker compose up -d

```



Stop containers:



```bash

docker compose down

```



\---



\## First-Time Setup



\### 1. Apply migrations \& start containers

Handled automatically when the container starts.



\### 2. Create admin user



```bash

docker exec -it beautitrust\_web python manage.py createsuperuser

```



\### 3. Load initial data



```bash

docker exec -it beautitrust\_web python core/import\_data.py

```



Admin panel:

```

http://localhost:8000/admin

```



\---



\## Project Structure



```

BeautiTrust/

├── backend/              # Django project configuration

├── core/                 # Main application logic

│   ├── models.py         # Database models

│   ├── views.py          # Template views

│   ├── api.py            # JSON API endpoints

│   ├── forms.py          # Registration forms

│   ├── admin.py          # Admin panel

│   └── import\_data.py    # Initial data script

├── templates/            # HTML templates

├── static/               # CSS, JS, images

├── Dockerfile

├── docker-compose.yml

└── requirements.txt

```



\---



\## Key Notes



\- Built primarily with Django templates (server-rendered UI)

\- Internal API used for dynamic frontend interactions

\- Session-based authentication (no JWT or OAuth)

\- Custom User model instead of Django default user

\- Cart supports multiple entity types (products, services, spots)

\- Commission system applied to transactions (10%)

\- Fully containerized with Docker + PostgreSQL



\---



\## Future Improvements



\- Payment gateway integration (Stripe / PayPal)

\- Email notifications for bookings and purchases

\- Advanced recommendation system (AI-based)

\- Search and filtering system

\- Performance optimization (caching \& indexing)

\- Mobile application (React Native or Flutter)
---



\## Author



\- Chaima El Fehri

