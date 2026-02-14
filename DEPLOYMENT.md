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
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

## Step 3: Create Virtual Environment

```bash
cd ~/your-repo
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

Add (replace with your values):
```
SECRET_KEY=your-super-secret-key-here-change-this
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://yourusername.pythonanywhere.com
```

Generate a new SECRET_KEY:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Save and exit (Ctrl+X, Y, Enter)

## Step 5: Database Setup

```bash
source venv/bin/activate
cd ~/your-repo
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
In the **Virtualenv** section:
```
/home/yourusername/your-repo/venv
```

### 6.3 Configure WSGI File
Click on the WSGI configuration file link, delete everything and replace with:

```python
import sys
import os
from pathlib import Path

# Add project directory to path
path = '/home/yourusername/your-repo'
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

**Important**: Replace `yourusername` and `your-repo` with your actual values!

### 6.4 Configure Static Files
In the **Static files** section, add:

| URL          | Directory                                    |
|--------------|---------------------------------------------|
| /static/     | /home/yourusername/your-repo/staticfiles    |
| /media/      | /home/yourusername/your-repo/media          |

### 6.5 Configure Source Code
In the **Code** section:
- **Source code**: `/home/yourusername/your-repo`
- **Working directory**: `/home/yourusername/your-repo`

## Step 7: Media Files Setup

```bash
cd ~/your-repo
mkdir -p media/adinkra_symbols
mkdir -p media/lesson_images
```

Upload your logo and media files to the appropriate directories.

## Step 8: Reload Web App

1. Click the green **Reload** button at the top
2. Visit: `https://yourusername.pythonanywhere.com`

## Step 9: Access Admin Panel

1. Go to: `https://yourusername.pythonanywhere.com/admin`
2. Login with superuser credentials
3. Add modules, lessons, and content

## Troubleshooting

### Check Error Logs
1. Go to **Web** tab
2. Click on **Error log** or **Server log**

### Common Issues

**Issue**: Static files not loading
```bash
cd ~/your-repo
source venv/bin/activate
python manage.py collectstatic --noinput
```
Then reload the web app.

**Issue**: Database errors
```bash
cd ~/your-repo
source venv/bin/activate
python manage.py migrate
```

**Issue**: Permission errors
```bash
chmod -R 755 ~/your-repo
chmod 644 ~/your-repo/db.sqlite3
```

**Issue**: Module not found
```bash
cd ~/your-repo
source venv/bin/activate
pip install -r requirements.txt
```

### View Django Shell
```bash
cd ~/your-repo
source venv/bin/activate
python manage.py shell
```

## Updating Your Site

When you push changes to GitHub:

```bash
cd ~/your-repo
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
   - CNAME record pointing to `yourusername.pythonanywhere.com`

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
