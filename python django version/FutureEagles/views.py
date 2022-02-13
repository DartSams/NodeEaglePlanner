from django.shortcuts import redirect, render
from django.http import HttpResponse,JsonResponse
from .models import Job,Google_user,Note
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def index(request,tab="tasks"): #defaults the tab to a empty string if user doesnt pass in a proper tab name such as notes,tasks,calendar
    # request.session["logged-in-user"] = "GUEST"
    # request.session["logged-in-user-id"] = "GUEST ID"
    if request.method == "GET":
        
        data={
            "current_user":request.session["logged-in-user"],
            "current_user_id":request.session["logged-in-user-id"],
            "tab":tab
        }
        note_tags=[]
        print(data)
        if request.session["logged-in-user"]:
            if tab in ["tasks","calendar"]:
                user_jobs = Job.objects.filter(user=data["current_user"],user_id=data["current_user_id"]) #search job db
                data["user_task"] = user_jobs

                data["tasks"] = [i.task for i in user_jobs]
                data["due_date"] = [i.due_date[5:] for i in user_jobs]


            elif tab =="notes":
                n = Note.objects.filter(user=data["current_user"],user_id=data["current_user_id"]) #search note db
                data["user_notes"] = n
                note_tags = set(tag.note_tag for tag in n if tag.note_tag not in note_tags) #searches the notes db for note tags and removes duplicates
                # print(note_tags)
                data["notes_tags"] = note_tags

            elif tab not in ["tasks","notes","calendar"]:
                print("not a valid tab page")

        else:
            print(f"User not logged in.")

        return render(request,"FutureEagles/html/home.html",data)

    else:
        print(request.POST)
        data_message = request.POST.get("data message")
        profile = request.POST.get("user")
        profile_id = request.POST.get("ID")
        profile_image = request.POST.get("profile image")
        profile_email = request.POST.get("email")

        existing_user = Google_user.objects.filter(user_id=profile_id) #queries the db for all users and finds the user with a specific id returned from ajax call

        try: #first if data from ajax call matches query above then will login user in
            print(f"User found {existing_user[0].profile_name}")
            print(f"{existing_user[0].profile_name} signing in")
            if existing_user[0]:
                request.session["logged-in-user"] = existing_user[0].profile_name
                request.session["logged-in-user-id"] = existing_user[0].user_id

        except: #if data from ajax call doesnt match query then will either sign user out of create new user
            if data_message == "signing out": #if data message in post request says signing out the user will be signed out
                request.session["logged-in-user"] = ""
                request.session["logged-in-user-id"] = ""
                print(f"signing out")
            else: #if data message doesnt say signing out and data from ajax call doesnt match query above this will create new user 
                print(f"User not found creating new user")
                user = Google_user(profile_name=profile,user_id=profile_id,user_image=profile_image,user_email=profile_email)
                user.save()

                new_task = Job(user=profile,user_id=profile_id,task="default",due_date="today",status="active")
                new_task.save()

        return redirect("index")

@csrf_exempt
def sign_in(request):
    if request.method == "POST":
        print("post activating")
        # return redirect("index")
        # return HttpResponse(200)
        # return render(request,"FutureEagles/html/home.html")

        print(request.POST)
        data_message = request.POST.get("data message")
        profile = request.POST.get("user")
        profile_id = request.POST.get("ID")
        profile_image = request.POST.get("profile image")
        profile_email = request.POST.get("email")

        existing_user = Google_user.objects.filter(user_id=profile_id) #queries the db for all users and finds the user with a specific id returned from ajax call

        try: #first if data from ajax call matches query above then will login user in
            print(f"User found {existing_user[0].profile_name}")
            print(f"{existing_user[0].profile_name} signing in")
            if existing_user[0]:
                request.session["logged-in-user"] = existing_user[0].profile_name
                request.session["logged-in-user-id"] = existing_user[0].user_id

        except: #if data from ajax call doesnt match query then will either sign user out of create new user
            if data_message == "signing out": #if data message in post request says signing out the user will be signed out
                request.session["logged-in-user"] = ""
                request.session["logged-in-user-id"] = ""
                print(f"signing out")
            else: #if data message doesnt say signing out and data from ajax call doesnt match query above this will create new user 
                print(f"User not found creating new user")
                user = Google_user(profile_name=profile,user_id=profile_id,user_image=profile_image,user_email=profile_email)
                user.save()

                new_task = Job(user=profile,user_id=profile_id,task="default",due_date="today",status="active")
                new_task.save()

        return redirect("index")

    else:
        # request.session["logged-in-user"] = "guest"
        # request.session["logged-in-user-id"] = "guest id"
        # return HttpResponse(200)
        return render(request,"FutureEagles/html/signin.html")
        # return render(request,"FutureEagles/html/home.html")

