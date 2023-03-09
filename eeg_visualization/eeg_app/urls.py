from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('upload', views.upload, name='upload'),
    path('postdata', views.handlePost, name="handlePost"),
    path('getdata', views.handleGet, name='handleGet'),

]