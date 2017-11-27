from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserMgr(BaseUserManager):
    def create_user(self, username, password):
        user = self.model(username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    objects = UserMgr()
    username = models.CharField(max_length=20, unique=True)
    email = models.CharField(max_length=50)
    cellphone = models.CharField(max_length=15)
    USERNAME_FIELD = 'username'  # declare that username to be unique
    is_active = models.BooleanField(default=True)
    is_shop = models.BooleanField(default=False)

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    class Meta:
        db_table = 'User'
