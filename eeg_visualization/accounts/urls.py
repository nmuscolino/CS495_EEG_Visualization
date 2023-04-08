from django.urls import path
from django.conf.urls import include
from . import views

urlpatterns = [
    path('', include('django.contrib.auth.urls')),
    path('signup', views.sign_up_view, name='signup'),
]