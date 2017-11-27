from django.db import models
from login.models import User

# Create your models here.


class Address(models.Model):
    province = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    county = models.CharField(max_length=30)
    street = models.CharField(max_length=400)
    consignee = models.CharField(max_length=30)
    consignee_tel = models.CharField(max_length=30)
    is_default = models.BooleanField(default=False)
    postcode = models.CharField(max_length=6)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Address'

    def __str__(self):
        return self.street


class Shop(models.Model):
    shopname = models.CharField(max_length=30)
    least_price = models.IntegerField()
    deliver_fee = models.IntegerField()
    review_score = models.DecimalField(max_digits=2, decimal_places=1)
    shop_img = models.ImageField(upload_to='uploads/')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Shop'

    def __str__(self):
        return self.shopname


class Merchandise(models.Model):
    title = models.CharField(max_length=30)
    price = models.IntegerField()
    image = models.ImageField(upload_to='goods/')
    shop_id = models.ForeignKey(Shop, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Merchandise'

    def __str__(self):
        return self.title


class SalesNum(models.Model):
    month = models.IntegerField()
    sales_num = models.IntegerField()
    merchan_id = models.ForeignKey(Merchandise, on_delete=models.CASCADE)

    class Meta:
        db_table = 'SalesNum'

    def __str__(self):
        return self.merchan_id


class Orders(models.Model):
    order_num = models.CharField(max_length=20)
    order_time = models.DateTimeField()
    total_price = models.IntegerField()
    status = models.IntegerField()  # 0 not confirmed 1 confirm 2 completed
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    shop_id = models.ForeignKey(Shop, on_delete=models.CASCADE, default=None)
    address_id = models.ForeignKey(
        Address, on_delete=models.CASCADE, default=None)

    class Meta:
        db_table = "Orders"

    def __str__(self):
        return self.order_num


class OrderDetail(models.Model):
    merchan_num = models.IntegerField()
    merchan_id = models.ForeignKey(Merchandise, on_delete=models.CASCADE)
    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE)

    class Meta:
        db_table = 'OrderDetail'

    def __str__(self):
        return str(self.merchan_id) + str(self.order_id)
