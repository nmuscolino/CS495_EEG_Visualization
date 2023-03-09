from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import process

data = []

# Create your views here.
def home(request):
    return render(request, "home.html")

def upload(request):
    return render(request, "upload.html")

@csrf_exempt
def handlePost(request):
    data.append(request.body)
    return HttpResponse()

def handleGet(request):
    print(len(data))
    positions = process.process_data(data)
    positions = json.dumps(positions)
    #f = open('eeg_app/media/clusters.json')
    #data = json.load(f)
    #positions = json.dumps(data)
    data.clear()
    return HttpResponse(positions)

