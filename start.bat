@echo off
echo ==========================================
echo   Adinkra Digital Learning Platform
echo ==========================================
echo.

:: Activate virtual environment
call venv\Scripts\activate

:: Run migrations
echo [1/4] Running database migrations...
python manage.py migrate

:: Populate database with sample data
echo [2/4] Populating database with Gye Nyame module...
python manage.py populate_gye_nyame

:: Create superuser if needed (skip if exists)
echo [3/4] Checking admin user...
python manage.py shell -c "from users.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin123')" 2>nul

:: Start server
echo [4/4] Starting development server...
echo.
echo ==========================================
echo   Server running at: http://127.0.0.1:8000/
echo   Admin panel: http://127.0.0.1:8000/admin/
echo   
echo   Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo ==========================================
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver
