#!/bin/bash
echo "=========================================="
echo "  Adinkra Digital Learning Platform"
echo "=========================================="
echo ""

# Activate virtual environment
source venv/bin/activate

# Run migrations
echo "[1/3] Running database migrations..."
python manage.py migrate

# Start server
echo "[2/3] Starting development server..."
echo ""
echo "=========================================="
echo "  Server running at: http://127.0.0.1:8000/"
echo "  Admin panel: http://127.0.0.1:8000/admin/"
echo ""
echo "  Admin Credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python manage.py runserver
