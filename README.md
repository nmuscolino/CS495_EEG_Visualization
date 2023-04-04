<h2>Test Procedures (Sprint 1)</h2>

Test procedures include uploading a point cloud file to the webpage and viewing the node locations in the generated visualization.

Once this is uploaded, review the Django log to ensure HTTP requests are being sent and received correctly.

The node coordinates are printed to the console under browser developer tools. Check this to ensure coordinates are being obtained correctly.

Check the developer tools console for any JavaScript errors when running the visualization.

<h2>Test Procedures (Sprint 2)</h2>

Similar to Sprint 1 procedures, but now users can upload PLY and JSON files in addition to PTS files for testing. Scan JSON coordinates are scanned in a backend database. Admin users can check the Django admin panel to confirm scans are being uploaded correctly.

After uploading a new scan, check that the points are rendering correctly in the visualization. Go back to the visualization page to ensure that the new scans are appearing in the table correctly.

As before, check for any JavaScript errors in the console developer tools when uploading and visualizing scans.

Use these testing procedures when testing the app locally hosted and when hosting on the internet.

<h2>Note:</h2>

We followed a tutorial on DigitalOcean's website to learn how to host the web app using Nginx and Gunicorn.
Source: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-22-04
