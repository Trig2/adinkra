# Deployment Guide - PythonAnywhere

## Prerequisites
- PythonAnywhere account (free or paid)
- Git repository (GitHub, GitLab, etc.)

## Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/Trig2/adinkra.git
git push -u origin main
```

## Step 2: PythonAnywhere Setup

### 2.1 Create Account
1. Go to [PythonAnywhere](https://www.pythonanywhere.com/)
2. Sign up for a free/paid account
3. Note your username (e.g., `yourusername`)

### 2.2 Open Bash Console
1. Go to **Consoles** tab
2. Start a new **Bash** console

### 2.3 Clone Your Repository
```bash
git clone https://github.com/Trig2/adinkra.git
cd adinkra
```

## Step 3: Create Virtual Environment

```bash
cd ~/adinkra
python3.10 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Step 4: Environment Configuration

Create `.env` file:
```bash
nano .env
```

Add these values (generate a new SECRET_KEY using the command below):
```
SECRET_KEY=your-super-secret-key-here-change-this
DEBUG=False
ALLOWED_HOSTS=webcraft.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://webcraft.pythonanywhere.com
```

**Important**: Use the HTTPS version of your domain. PythonAnywhere provides HTTPS automatically.

Generate a new SECRET_KEY:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and paste it as the SECRET_KEY value (no quotes needed).

Save and exit (Ctrl+X, Y, Enter)

## Step 5: Database Setup

```bash
source venv/bin/activate
cd ~/adinkra
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput

# Populate initial data
python manage.py populate_modules
python manage.py populate_gye_nyame
```

## Step 6: Web App Configuration

### 6.1 Create Web App
1. Go to **Web** tab
2. Click **Add a new web app**
3. Choose **Manual configuration**
4. Select **Python 3.10**

### 6.2 Configure Virtual Environment
In the **Virtualenv** section, enter:
```
/home/webcraft/adinkra/venv
```

### 6.3 Configure WSGI File
Click on the WSGI configuration file link, delete everything and replace with:

```python
import sys
import os
from pathlib import Path

# Add project directory to path
# IMPORTANT: Replace 'webcraft' with YOUR username and 'adinkra' with YOUR repo name
path = '/home/webcraft/adinkra'
if path not in sys.path:
    sys.path.insert(0, path)

# Set environment variables
os.environ['DJANGO_SETTINGS_MODULE'] = 'adinkra_platform.settings'

# Load environment variables from .env file
from pathlib import Path
env_file = Path(path) / '.env'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key, value)

# Import Django app
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

**Critical**: The `path` variable must point to the directory containing your Django project (where `manage.py` and `adinkra_platform/` folder are located).

### 6.4 Configure Static Files
In the **Static files** section, add these mappings:

| URL          | Directory                                    |
|--------------|---------------------------------------------|
| /static/     | /home/webcraft/adinkra/staticfiles          |
| /media/      | /home/webcraft/adinkra/media                |

**Note**: The newer PythonAnywhere interface no longer has a "Source code" or "Working directory" section in the Web tab. These are configured automatically based on your WSGI file path. If you see these fields, set them to `/home/webcraft/adinkra`.

## Step 7: Media Files Setup

Create media directories in the bash console:
```bash
cd ~/adinkra
mkdir -p media/adinkra_symbols
mkdir -p media/lesson_images
```

Upload your logo and media files to the appropriate directories using PythonAnywhere's Files interface.

## Step 8: Reload Web App

1. Click the green **Reload** button at the top of the Web tab
2. Visit: `https://webcraft.pythonanywhere.com`
3. If you see errors, check the **Error log** tab for details

## Step 9: Access Admin Panel

1. Go to: `https://webcraft.pythonanywhere.com/admin`
2. Login with superuser credentials
3. Add modules, lessons, and content

## Troubleshooting

### Check Error Logs
1. Go to **Web** tab
2. Click on **Error log** or **Server log**

### Common Issues

**Issue**: ModuleNotFoundError: No module named 'adinkra_platform'
- **Cause**: WSGI file path is incorrect
- **Fix**: Edit WSGI file, ensure `path = '/home/webcraft/adinkra'` (line ~9)
- Make sure the path points to the directory containing `manage.py` and `adinkra_platform/`
- Save and reload the web app

**Issue**: Static files not loading
```bash
cd ~/adinkra
source venv/bin/activate
python manage.py collectstatic --noinput
```
Then reload the web app.

**Issue**: Database errors
```bash
cd ~/adinkra
source venv/bin/activate
python manage.py migrate
```

**Issue**: Permission errors
```bash
chmod -R 755 ~/adinkra
chmod 644 ~/adinkra/db.sqlite3
```

**Issue**: Module not found (after path is correct)
```bash
cd ~/adinkra
source venv/bin/activate
pip install -r requirements.txt
```

### View Django Shell
```bash
cd ~/adinkra
source venv/bin/activate
python manage.py shell
```

**Issue**: Login/Registration failing with no error message
- **Cause**: CORS configuration not set correctly
- **Fix**: Make sure your `.env` file has the correct CORS_ALLOWED_ORIGINS:
  ```bash
  cd ~/adinkra
  nano .env
  ```
  Add or update this line (replace `webcraft` with your username):
  ```
  CORS_ALLOWED_ORIGINS=https://webcraft.pythonanywhere.com
  ```
  Save (Ctrl+X, Y, Enter) and reload the web app.
- **Also check**: Browser console (F12) for CORS errors. If you see "blocked by CORS policy", this confirms the issue.

## Updating Your Site

When you push changes to GitHub:

```bash
cd ~/adinkra
git pull origin main
source venv/bin/activate
pip install -r requirements.txt  # If requirements changed
python manage.py migrate  # If models changed
python manage.py collectstatic --noinput
```

Then reload the web app from the Web tab.

## Custom Domain (Paid Accounts Only)

1. Go to **Web** tab
2. Add your custom domain
3. Update DNS settings at your domain registrar:
   - CNAME record pointing to `webcraft.pythonanywhere.com`

## Security Checklist

- ✅ DEBUG=False in production
- ✅ Strong SECRET_KEY generated
- ✅ ALLOWED_HOSTS configured
- ✅ Database backed up regularly
- ✅ Media files secured
- ✅ HTTPS enabled (automatic on PythonAnywhere)

## Useful Links

- [PythonAnywhere Help](https://help.pythonanywhere.com/)
- [Django Deployment](https://help.pythonanywhere.com/pages/DeployExistingDjangoProject/)
- [Static Files](https://help.pythonanywhere.com/pages/DjangoStaticFiles/)

## Support

For PythonAnywhere-specific issues:
- Forum: https://www.pythonanywhere.com/forums/
- Email: support@pythonanywhere.com
