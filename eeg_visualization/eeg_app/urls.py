from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('input', views.input, name='input'),
    path('postdata', views.handlePost, name="handlePost"),

]