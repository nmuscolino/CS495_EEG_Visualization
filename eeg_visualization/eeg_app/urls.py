from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload, name='upload'),
    path('upload', views.upload, name='upload'),
    path('positions', views.Positions, name="positions"),
    path('colors', views.Colors, name="colors"),
    path('process', views.Process, name='process'),
    path('getdbdata', views.GetDbData, name='getdbdata'),
    path('visualize', views.visualize, name='visualize'),
    path('postjsondata', views.PostJSON, name='postjsondata'),
    path('getdbdatawithjson', views.GetDbDataWithJson, name='getdbdatawithjson'),
]