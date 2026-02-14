# Digital Literacy & Heritage Platform
## Adinkra Digital Learning Initiative

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)

### 🌟 Project Overview

A mobile-first Progressive Web App that teaches digital literacy (WhatsApp, mobile money, online resources) through the cultural framework of Adinkra symbols, making learning contextual and culturally resonant for Ghanaian communities.

**࿋ Where Culture Meets Technology**

---

<!-- ## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Components](#project-components)
- [Contributing](#contributing)
- [License](#license)

--- -->

## ✨ Features

### Learning Platform
- ✅ **Cultural Integration**: Each module connects to an Adinkra symbol
- ✅ **Mobile-First Design**: Optimized for smartphones with Tailwind CSS
- ✅ **Progressive Web App**: Offline capability, installable, fast
- ✅ **Low-Data**: Designed for areas with limited connectivity
- ✅ **Rich Media Support**: Images and YouTube video integration in lessons
- ✅ **Interactive Lessons**: Text, video, quizzes, and practical exercises
- ✅ **Progress Tracking**: Monitor learning journey with detailed statistics
- ✅ **Certification**: Earn certificates upon module completion

### Technical Features
- ✅ Django REST Framework API
- ✅ User authentication and profiles
- ✅ Admin interface for content management
- ✅ Service Worker for offline support
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Quiz system with immediate feedback
- ✅ URL routing with browser history support
- ✅ Achievement badges and gamification

---

## 🛠 Technology Stack

### Backend
- **Framework**: Django 5.0.2
- **API**: Django REST Framework 3.14.0
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: Django Auth System
- **Image Processing**: Pillow

### Frontend
- **Framework**: Vanilla JavaScript (Progressive Web App)
- **Styling**: Tailwind CSS 3.x
- **Icons**: Unicode Adinkra Symbols
- **Service Worker**: Custom offline caching strategy

### DevOps
- **WSGI Server**: Gunicorn
- **Static Files**: WhiteNoise
- **Environment**: Python Decouple

---

## 📁 Project Structure

```
selorm/
├── adinkra_platform/          # Django project settings
│   ├── settings.py            # Main configuration
│   ├── urls.py                # URL routing
│   ├── views.py               # Frontend view
│   └── wsgi.py                # WSGI configuration
│
├── learning/                  # Learning content app
│   ├── models.py              # Module, Lesson, Quiz models
│   ├── admin.py               # Admin interface
│   ├── management/            # Management commands
│   │   └── commands/
│   │       └── populate_gye_nyame.py  # Seed data
│   └── migrations/
│
├── users/                     # User management app
│   ├── models.py              # User, Progress, Achievement models
│   ├── admin.py               # User admin interface
│   └── migrations/
│
├── api/                       # REST API app
│   ├── views.py               # API viewsets
│   ├── serializers.py         # API serializers
│   └── urls.py                # API routing
│
├── templates/                 # HTML templates
│   └── index.html             # Main PWA template
│
├── static/                    # Static files
│   ├── js/
│   │   └── app.js             # Main application logic
│   ├── sw.js                  # Service Worker
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons
│
├── docs/                      # Documentation
│   ├── CURRICULUM.md          # Full curriculum outline
│   ├── PILOT_PLAN.md          # Community pilot program details
│   └── PITCH_SUSTAINABILITY.md # Sustainability and funding plan
│
├── manage.py                  # Django management script
├── requirements.txt           # Python dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🚀 Installation

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)
- Git

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd selorm
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Database Setup

```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Populate with Gye Nyame module content
python manage.py populate_gye_nyame
```

### Step 5: Run Development Server

```bash
python manage.py runserver
```

Visit: `http://127.0.0.1:8000/`

---

## 💻 Usage

### Admin Interface

Access the Django admin at `http://127.0.0.1:8000/admin/`

**Here you can:**
- Create and manage Adinkra symbols
- Add new learning modules
- Create lessons with rich content blocks
  - Text, headings, tips, warnings, examples
  - Upload images for visual learning
  - Add YouTube video URLs for multimedia content
- Build quizzes and questions
- View user progress
- Manage user accounts

### API Endpoints

Base URL: `http://127.0.0.1:8000/api/`

**Available endpoints:**
- `/modules/` - List all learning modules
- `/modules/{slug}/` - Module details
- `/lessons/` - List all lessons
- `/lessons/{slug}/` - Lesson details
- `/symbols/` - Adinkra symbols
- `/quizzes/` - Quiz list
- `/progress/` - User progress
- `/achievements/` - User achievements

### Creating Custom Modules

```bash
# Create a custom management command
# See: learning/management/commands/populate_gye_nyame.py
# Then run:
python manage.py populate_your_module
```

---

## 📚 Project Components

### 1. Content & Pedagogy Unit

**✅ Completed**: Gye Nyame Module
- 4 comprehensive lessons on digital safety
- Cultural integration with Adinkra symbol
- 5-question assessment quiz
- Passing score: 70%

**Future Modules** (outlined in `docs/CURRICULUM.md`):
- Sankofa: Digital Communication
- Duafe: Mobile Money & Digital Finance
- Adinkrahene: Online Resources & Information Literacy
- Nyansapo: Social Media Literacy
- Dwe: Digital Business & E-Commerce

### 2. Tech & UX Unit  

**✅ Completed**: Progressive Web App
- Mobile-first responsive design
- Tailwind CSS styling
- Offline capability with Service Worker
- Low-data consumption (<5MB per module)
- Cross-platform compatibility

### 3. Community Pilot Unit

**✅ Completed**: Comprehensive 4-Week Pilot Plan
- 2 target communities identified
- Budget: GHS 83,600 for both communities
- Detailed weekly schedule
- Assessment and evaluation framework
- See: `docs/PILOT_PLAN.md`

### 4. Integration & Pitch

**✅ Completed**: Working Prototype + Business Plan
- Fully functional platform with one complete module
- REST API for future mobile apps
- Sustainability plan with revenue model
- Partnership strategy
- See: `docs/PITCH_SUSTAINABILITY.md`

---

## 🌐 API Documentation

### Modules API

```http
GET /api/modules/
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Gye Nyame: Digital Safety & Privacy",
    "slug": "gye-nyame-cybersecurity",
    "description": "Learn how to protect yourself online...",
    "adinkra_symbol": {
      "name": "Gye Nyame",
      "meaning": "Except God",
      "cultural_significance": "Gye Nyame symbolizes..."
    },
    "digital_literacy_topic": "Cybersecurity & Data Privacy",
    "estimated_duration_minutes": 45,
    "difficulty_level": "beginner",
    "lesson_count": 4
  }
]
```

### Submit Quiz

```http
POST /api/quizzes/{id}/submit/
Content-Type: application/json

{
  "answers": {
    "1": 3,  // question_id: answer_id
    "2": 2,
    "3": 1
  }
}
```

**Response:**
```json
{
  "score": 80,
  "passed": true,
  "earned_points": 8,
  "total_points": 10
}
```

---

<!-- ## 🤝 Contributing

We welcome contributions from:
- Developers (frontend, backend, mobile)
- Content creators (curriculum development)
- Linguists (Twi, Ga, other languages)
- Community organizers
- Designers (UI/UX, graphics)

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

--- -->

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Contact

**Project Lead**: [Your Name]  
**Email**: info@adinkralearning.org  
**Location**: Accra, Ghana

---

## 🙏 Acknowledgments

- Local linguists and historians for cultural consultation
- Pilot community partners
- Ghana Ministry of Education advisors
- All contributors and supporters

---

## 🎯 Next Steps

### Immediate (This Week)
- [ ] Complete pilot program preparations
- [ ] Test on various devices
- [ ] Gather initial user feedback

### Short-term (This Month)
- [ ] Launch 2 pilot programs
- [ ] Develop second module (Sankofa)
- [ ] Secure institutional partnerships

### Long-term (This Year)
- [ ] Scale to 10,000 users
- [ ] Add Twi and Ga language support
- [ ] Integrate with government digital literacy programs
- [ ] Launch mobile apps (Android/iOS)

---

**࿋ Adinkra Digital Learning - Empowering Ghana Through Heritage and Technology**

*"Sankofa: Go back and fetch it" - We honor our past while building our digital future.*
