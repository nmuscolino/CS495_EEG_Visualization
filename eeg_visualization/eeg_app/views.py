from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from datetime import datetime
import json

from . import process
from .models import Scan

@login_required
# Render the visualization page
def visualize(request):
    return render(request, "visualize.html")

@login_required
# Render the upload page
def upload(request):
    return render(request, "upload.html")

@csrf_exempt
# Process position data on backend
def Positions(request):
    process.add_positions(request.body)
    return HttpResponse()

@csrf_exempt
# Process color data on backend
def Colors(request):
    process.add_colors(request.body)
    return HttpResponse()

@csrf_exempt
# Save new scan to database if user uploads a JSON file
def PostJSON(request):
    print("here")
    requestBody = request.body.decode("utf-8")
    elements = requestBody.split('!')
    new_scan = Scan(scan_name=elements[0], scan_json=elements[1])
    new_scan.save()
    return HttpResponse()

@csrf_exempt
# Call backend code to compute electrode coordinates and save new entries to database
def Process(request):
    positions = process.process_data()

    # If the scan name is passed from the frontend, add an entry in the database
    if request.method == "POST":
        new_scan = Scan(user=request.user, scan_name=request.body.decode("utf-8"), scan_json=positions)
        new_scan.save()

    return HttpResponse(positions)

# Get all scan data from current logged-in user to display in upload table
def GetDbData(request):
    # Obtain a QuerySet of all scans in the database, ordered by most recent upload date
    tableData = Scan.objects.filter(user=request.user).order_by("-upload_date")

    # Convert the data to JSON format and return it as an HTTPResponse
    tableData_json = serializers.serialize("json", tableData, fields=("scan_name", "upload_date"))
    return HttpResponse(tableData_json)

# Get all scan data from current logged-in user with JSON coordinates for visualization
def GetDbDataWithJson(request):
    tableData = Scan.objects.all().filter(user=request.user).order_by("-upload_date")
    # Convert the data to JSON format and return it as an HTTPResponse
    tableData_json = serializers.serialize("json", tableData, fields=("scan_name", "upload_date", "scan_json"))
    return HttpResponse(tableData_json)

# Identify the selected scan in the database and remove it
def delete(request, id):
    scan = Scan.objects.get(id=id)
    scan.delete()
    return HttpResponseRedirect(reverse('upload'))