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

We followed a tutorial on DigitalOcean's website to learn how to host the web app using Nginx and Gunicorn. <br>
Source: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-22-04 <br>

<h2>Instructions for Running on AWS</h2>
Create an AWS EC2 Instance. The project has been tested on m4.large. <br>
Use Ubuntu as the operating system and give it 30 GB of disk space. Allow HTTP <br>
traffic on port 80. Create a key pair and launch the instance. <br>
<br>
Use Route 53 to register a domain name. (You will need to substitute your domain name in eeg_visualization.conf) <br>
In the hosted zone for your domain name direct traffic to the public ip address of the EC2 instance. <br>
<br>
SSH into the instance using your key pair. The command is: <br>
ssh -i /path/key.pem ubuntu@publicipv4address <br>
Then run the following commands exactly as they appear below: <br>
<br>
mkdir Project
cd Project https://github.com/nmuscolino/CS495_EEG_Visualization.git <br>
git clone <br>
cd CS495_EEG_Visualization <br>
cd eeg_visualization <br>
chmod 755 launch_server.sh <br>
./launch_server.sh <br>
    <br>
Now you should be able to navigate to your domain name and see the website <br>
                                            <br>
<h2>Instructions for Running Locally</h2>
Clone the repository <br>
Navigate to the top level eeg_visualization directory <br>
Create a virtual environment and install dependencies <br>
Activate Virtual Environment <br>
Run the following commands: <br>
python3 manage.py makemigrations <br>
python3 manage.py migrate <br>
                            <br>
To launch the application run: <br>
python3 manage.py runserver 8000 <br>
                                <br>
Navigate to localhost:8000 in your browser to use the application. <br>