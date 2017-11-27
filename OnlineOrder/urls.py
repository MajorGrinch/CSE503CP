"""OnlineOrder URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url

from . import views

app_name = 'login'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^authorize$', views.authorize, name='authorize'),
    url(r'^jmp_register$', views.jmp_to_register, name='jmp_to_register'),
    url(r'^register_page$', views.register_page, name='register_page'),
    url(r'^registered$', views.register, name='register'),
    url(r'duplicated_username', views.handle_duplicate, name="duplicated_username"),
    url(r'^log_out$', views.log_out, name='log_out'),
]
