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

<h2>Test Procedures (Sprint 3)</h2>

In addition to test procedures from Sprint 2, it is important to test creating user accounts and switching between them. Upon creating a new account from the signup page, check the Django admin panel to ensure the new user account was added to the database. (Admin accounts must be created from the console using Django commands, or existing admins can give other accounts admin roles.) Logging in and out and switching between users should be a straightforward process.

Check to ensure that only scans uploaded by the current user are shown in the table. Verify which scans belong to each user from the admin panel.

To test the app's performance, try uploading several files consecutively to ensure it can handle multiple uploads in quick succession. Confirm error messaging is working by attempting to upload without providing a name or a file.

To test the visualization, try switching between available scans very quickly and adjusting the perspective in the visualization window. Ensure the frame rate remains consistent and the web app does not slow down.

<h2>Note:</h2>

We followed a tutorial on DigitalOcean's website to learn how to host the web app using Nginx and Gunicorn.

Source: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-22-04

<h2>Instructions for Running on AWS</h2>

Create an AWS EC2 Instance. The project has been tested on m4.large.
Use Ubuntu as the operating system and allocate 30 GB of disk space.

Allow HTTP traffic on port 80. Create a key pair and launch the instance.

Use Route 53 to register a domain name. (You will need to substitute your domain name in eeg_visualization.conf)

In the hosted zone for your domain name direct traffic to the public ip address of the EC2 instance.

SSH into the instance using your key pair. The command is:

```
ssh -i /path/key.pem ubuntu@publicipv4address
```

Then run the following commands exactly as they appear below:

```
mkdir Project
cd Project https://github.com/nmuscolino/CS495_EEG_Visualization.git
git clone
cd CS495_EEG_Visualization
cd eeg_visualization
chmod 755 launch_server.sh
./launch_server.sh
```

Now you should be able to navigate to your domain name and see the website.

<h2>Instructions for Running Locally</h2>

Clone the repository

Navigate to the top level eeg_visualization directory

Create a virtual environment and install dependencies

Activate Virtual Environment

Run the following commands:

```
python3 manage.py makemigrations
python3 manage.py migrate
```

To launch the application run:
```
python3 manage.py runserver 8000
```

Navigate to localhost:8000 in your browser to use the application.
