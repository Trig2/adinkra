from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def index(request):
    """
    Serve the main PWA application
    """
    return render(request, 'index.html')
