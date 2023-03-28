from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json
from . import process
from .models import Scan


# Create your views here.
def home(request):
    return render(request, "home.html")

def visualize(request):
    return render(request, "visualize.html")

def upload(request):
    #scans = Scan.objects.all()
    #context = {"scans": scans}
    return render(request, "upload.html")#, context)

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

@csrf_exempt
def Process(request):
    positions = process.process_data()
    positions = json.dumps(positions)

    # If the scan name is passed from the frontend, add an entry in the database
    if request.method == "POST":
        new_scan = Scan(scan_name=request.body.decode("utf-8"), scan_json=positions)
        new_scan.save()

    return HttpResponse(positions)

def GetDbData(request):
    #tableData = {
    #    "BlakeScan": ["01/14/23", "Ready"],
    #    "NickScan": ["01/16/23", "Ready"],
    #    "JackScan": ["02/27/23", "Ready"],
    #    "WardScan": ["01/13/23", "Ready"]
    #}
    #tableData = json.dumps(tableData)

    # Obtain a QuerySet of all scans in the database, ordered by most recent upload date
    tableData = Scan.objects.all().order_by("-upload_date")

    # Convert the data to JSON format and return it as an HTTPResponse
    tableData_json = serializers.serialize("json", tableData, fields=("scan_name", "upload_date"))
    return HttpResponse(tableData_json)


def GetJsonFromDB(request, id=None):
    id = int(id)
    tableData = get_object_or_404(Scan, id = id)
    print(tableData.scan_json)
    return HttpResponse(tableData.scan_json)

