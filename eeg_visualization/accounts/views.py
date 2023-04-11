from django.shortcuts import render, redirect
from . import forms

# Create your views here.

# Allow a user to create an account
def sign_up_view(request):
    if request.method == "POST":
        form = forms.CreateAccountForm(request.POST)
        if form.is_valid():
            user = form.save()
            return redirect("upload")
    else:
        form = forms.CreateAccountForm()
    return render(request, "signup.html", {"form": form})