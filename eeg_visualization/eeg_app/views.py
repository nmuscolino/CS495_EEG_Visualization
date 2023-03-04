from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here.
def home(request):
    return render(request, "home.html")

def input(request):
    return render(request, "input.html")

@csrf_exempt
def handlePost(request):
    #print("print working")
    print(request.body)
    #print("after second print")
    
    x = {
    "sensor1": [1, 5, 7],
    "sensor2": [2, 3, 6],
    "sensor3": [5.2, 3.1, 1.6]
    }
    y = json.dumps(x)
    return HttpResponse(y)