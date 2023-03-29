from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json
from . import process
from .models import Scan

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

@csrf_exempt
def PostJSON(request):
    print("here")
    requestBody = request.body.decode("utf-8")
    elements = requestBody.split('!')
    new_scan = Scan(scan_name=elements[0], scan_json=elements[1])
    new_scan.save()
    return HttpResponse()


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
    # Obtain a QuerySet of all scans in the database, ordered by most recent upload date
    tableData = Scan.objects.all().order_by("-upload_date")

    # Convert the data to JSON format and return it as an HTTPResponse
    tableData_json = serializers.serialize("json", tableData, fields=("scan_name", "upload_date"))
    return HttpResponse(tableData_json)


def GetDbDataWithJson(request):
    tableData = Scan.objects.all().order_by("-upload_date")
    # Convert the data to JSON format and return it as an HTTPResponse
    tableData_json = serializers.serialize("json", tableData, fields=("scan_name", "upload_date", "scan_json"))
    return HttpResponse(tableData_json)


