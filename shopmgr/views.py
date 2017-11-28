from django.shortcuts import render, get_object_or_404
from django.template import loader
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from login.models import User
import json
from mainpage.models import Orders, OrderDetail, Address
from mainpage.models import Shop, Merchandise, SalesNum
from datetime import datetime
import decimal


# Create your views here.

def json_serialize(obj):
    if isinstance(obj, datetime):
        serial = obj.isoformat()
        return serial
    raise TypeError('Type not serializable')


def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError('Type not serializable')


def index(request):
    print("show index")
    shop = Shop.objects.get(user_id_id=request.user.id)
    shop_id = shop.id
    complete_order_count = Orders.objects.filter(shop_id_id=shop_id, status=2).count()
    order_tobe_comfirm_count = Orders.objects.filter(shop_id_id=shop_id, status=0).count()
    print(order_tobe_comfirm_count)
    return render(request, 'shopmgr/index.html',
                  {'user': request.user,
                   'complete_order_count': complete_order_count,
                   'order_tobe_confirm': order_tobe_comfirm_count})


def show_today_orders_shop(request):
    print("show today orders")
    shop = Shop.objects.get(user_id_id=request.user.id)
    shop_id = shop.id
    order_table = Orders.objects.filter(shop_id_id=shop_id, status=1).values()
    order_list = list(order_table)
    for order in order_list:
        addr_id = order['address_id_id']
        addr = Address.objects.get(pk=addr_id)
        order['address_id_id'] = addr.province + addr.city + addr.county + addr.street

    # print(order_list)
    response_data = {}
    response_data['orders'] = order_list
    return HttpResponse(json.dumps(response_data, default=json_serialize))


def show_incoming_orders(request):
    shop = Shop.objects.get(user_id_id=request.user.id)
    shop_id = shop.id
    order_table = Orders.objects.filter(shop_id_id=shop_id, status=0).values()
    order_list = list(order_table)
    for order in order_list:
        addr_id = order['address_id_id']
        addr = Address.objects.get(pk=addr_id)
        order['address_id_id'] = addr.province + addr.city + addr.county + addr.street

    response_data = {}
    response_data['orders'] = order_list
    return HttpResponse(json.dumps(response_data, default=json_serialize))


def show_completed_orders(request):
    shop = Shop.objects.get(user_id_id=request.user.id)
    shop_id = shop.id
    order_table = Orders.objects.filter(shop_id_id=shop_id, status=2).values()
    order_list = list(order_table)
    for order in order_list:
        addr_id = order['address_id_id']
        addr = Address.objects.get(pk=addr_id)
        order['address_id_id'] = addr.province + addr.city + addr.county + addr.street

    response_data = {}
    response_data['orders'] = order_list
    return HttpResponse(json.dumps(response_data, default=json_serialize))


def complete_shopinfo(request):
    shop = Shop.objects.get(user_id_id=request.user.id)
    print(shop)
    return render(request, 'shopmgr/complete_shopinfo.html', {'user': request.user, 'shop': shop})


def show_personal_info(request):
    shop = Shop.objects.filter(user_id_id=request.user.id).values()
    shop_info = list(shop)
    response_data = {}
    response_data['shop_info'] = shop_info
    return HttpResponse(json.dumps(response_data, default=decimal_default))


def add_icon(request):
    if request.method == 'POST':
        shop = Shop.objects.get(user_id_id=request.user.id)
        image_file = request.FILES['icon']
        deliver_fee = int(request.POST['deliver_fee'])
        least_price = int(request.POST['least_price'])
        shopname = request.POST['shopname']
        try:
            Shop.objects.filter(user_id_id=request.user.id).update(
                shopname=shopname, deliver_fee=deliver_fee, least_price=least_price)
            if image_file:
                shop.shop_img = image_file
                shop.save()
            return HttpResponseRedirect(reverse("shopmgr:complete_shopinfo"))
        except:
            return render(request, 'shopmgr/complete_shopinfo.html',
                          {'user': request.user, 'message': 'Uploading failed!'})


def add_goods(request):
    if request.method == 'POST':
        title = request.POST['title']
        price = int(request.POST['price'])
        image_file = request.FILES['icon']
        shop = Shop.objects.get(user_id_id=request.user.id)
        shop_id = shop.id
        try:
            m = Merchandise(title=title, price=price, shop_id_id=shop_id)
            m.image = image_file
            m.save()
            return HttpResponseRedirect(reverse("shopmgr:jmp_to_manage_goods"))
        except:
            return render(request, 'shopmgr/manage_goods.html', {'user': request.user, 'message': 'Uploading failed!'})


def jmp_to_manage_goods(request):
    shop = Shop.objects.get(user_id_id=request.user.id)
    shop_id = shop.id
    m = Merchandise.objects.filter(shop_id_id=shop_id).values()
    goods_list = list(m)
    print(goods_list)
    return render(request, 'shopmgr/manage_goods.html', {'user': request.user, 'goods_list': goods_list})


def delete_good(request):
    good_id = int(request.POST['good_id'])
    try:
        Merchandise.objects.get(pk=good_id).delete()
        return HttpResponse(1)
    except:
        return HttpResponse(0)


def confirm_order(request):
    order_num = request.POST['order_num']
    order = Orders.objects.get(order_num=order_num)
    order.status = 1
    order.save()
    return HttpResponse(1)
