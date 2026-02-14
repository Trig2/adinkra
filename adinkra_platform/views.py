from django.shortcuts import render


def index(request):
    """
    Serve the main PWA application
    """
    return render(request, 'index.html')
