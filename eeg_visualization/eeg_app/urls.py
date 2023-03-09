from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('upload', views.upload, name='upload'),
    path('positions', views.Positions, name="positions"),
    path('colors', views.Colors, name="colors"),
    path('getvisualizationdata', views.GetVisualizationData, name='getvisualizationdata'),
    path('process', views.Process, name='process'),
]