from django.conf.urls import url

from . import views

app_name = 'login'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^authorize$', views.authorize, name='authorize'),
    url(r'^jmp_register$', views.jmp_to_register, name='jmp_to_register'),
    url(r'^register_page$', views.register_page, name='register_page'),
    url(r'^registered$', views.register, name='register'),
    url(
        r'duplicated_username',
        views.handle_duplicate,
        name="duplicated_username"),
    url(r'^log_out$', views.log_out, name='log_out'),
]
