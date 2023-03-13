from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import process

# Create your views here.
def home(request):
    return render(request, "home.html")

def upload(request):
    return render(request, "upload.html")

@csrf_exempt
def Positions(request):
    process.add_positions(request.body)
    return HttpResponse()

@csrf_exempt
def Colors(request):
    process.add_colors(request.body)
    return HttpResponse()

def GetVisualizationData(request):
    f = open('eeg_app/media/clusters.json')
    data = json.load(f)
    positions = json.dumps(data)
    f.close()
    return HttpResponse(positions)

def Process(request):
    positions = process.process_data()
    positions = json.dumps(positions)
    return HttpResponse(positions)

def GetDbData(request):
    tableData = {
        "BlakeScan": ["01/14/23", "Ready"],
        "NickScan": ["01/16/23", "Ready"],
        "JackScan": ["02/27/23", "Ready"],
        "WardScan": ["01/13/23", "Ready"]
    }
    tableData = json.dumps(tableData)
    return HttpResponse(tableData)

