from django.urls import path
from . import views
from django.contrib import admin

urlpatterns = [
    path("<str:tab>",views.index,name="index"),
    path("",views.index,name="index"), #needed to make url parameters optional
    path('admins/', admin.site.urls),
    path("account/signin/",views.sign_in,name="sign in")
]