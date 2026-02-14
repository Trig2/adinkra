# Quick Deployment Checklist for PythonAnywhere

## Before Deployment
- [ ] Push code to GitHub
- [ ] Test locally with DEBUG=False
- [ ] Update requirements.txt if needed
- [ ] Have logo and media files ready

## PythonAnywhere Setup
- [ ] Create PythonAnywhere account at https://www.pythonanywhere.com/
- [ ] Open Bash console
- [ ] Clone repository: `git clone https://github.com/yourusername/your-repo.git`
- [ ] Create virtual environment: `python3.10 -m venv venv`
- [ ] Activate venv: `source venv/bin/activate`
- [ ] Install dependencies: `pip install -r requirements.txt`

## Configuration
- [ ] Create .env file with:
  - SECRET_KEY (generate new one)
  - DEBUG=False
  - ALLOWED_HOSTS=yourusername.pythonanywhere.com
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Collect static files: `python manage.py collectstatic --noinput`
- [ ] Populate data: `python manage.py populate_modules && python manage.py populate_gye_nyame`

## Web App Configuration
- [ ] Create new web app (Manual configuration, Python 3.10)
- [ ] Set virtualenv path: `/home/yourusername/your-repo/venv`
- [ ] Update WSGI file (see DEPLOYMENT.md)
- [ ] Configure static files:
  - /static/ → /home/yourusername/your-repo/staticfiles
  - /media/ → /home/yourusername/your-repo/media
- [ ] Set source code path
- [ ] Reload web app

## Post-Deployment
- [ ] Visit site: https://yourusername.pythonanywhere.com
- [ ] Test login/admin panel
- [ ] Upload media files (logo, symbols)
- [ ] Test all pages (home, modules, lessons)
- [ ] Check mobile responsiveness
- [ ] Test video links
- [ ] Verify offline functionality (PWA)

## Your Site Details
- Username: _______________
- Site URL: https://_______________.pythonanywhere.com
- Admin URL: https://_______________.pythonanywhere.com/admin
- Superuser: _______________

## Support
- Full guide: See DEPLOYMENT.md
- PythonAnywhere help: https://help.pythonanywhere.com/
