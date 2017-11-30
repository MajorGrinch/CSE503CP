from django.conf.urls import url

from . import views

app_name = 'shopmgr'

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^show_today_orders_shop$', views.show_today_orders_shop, name='show_today_orders_shop'),
    url(r'^complete_shopinfo$', views.complete_shopinfo, name='complete_shopinfo'),
    url(r'^show_personal_info$', views.show_personal_info, name='show_personal_info'),
    url(r'^add_icon$', views.add_icon, name='add_icon'),
    url(r'^show_incoming_orders$', views.show_incoming_orders, name="show_incoming_orders"),
    url(r'^show_completed_orders$',views.show_completed_orders, name="show_completed_orders"),
    url(r'^add_goods$', views.add_goods, name="add_goods"),
    url(r'^jmp_to_manage_goods$', views.jmp_to_manage_goods, name="jmp_to_manage_goods"),
    url(r'^delete_good$', views.delete_good, name="delete_good"),
    url(r'^confirm_order$', views.confirm_order, name="confirm_order"),
    url(r'^decline_order$', views.decline_order, name="decline_order"),
]