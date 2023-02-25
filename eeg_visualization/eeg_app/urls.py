from django.urls import path

from . import views

urlpatterns = [
    path('', views.input, name='input'),
    path('home', views.home, name='home'),
    path('postdata', views.handlePost, name="handlePost"),
    
]