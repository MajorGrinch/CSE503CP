
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function getAllFoods(shopId) {
    $(".cup").empty();
    console.log(shopId);
    $.post("/mainpage/get_merchandises", { shop_id: shopId, csrfmiddlewaretoken: csrftoken }, function(data, status) {
        var obj = JSON.parse(data);
        console.log(data);
        var arrayObj = obj.foodsArray;
        var arrayLen = arrayObj.length;
        for (var i = 0; i < arrayLen; i++) {
            var foodId = arrayObj[i].id;
            var shopImagePath = arrayObj[i].image;
            var foodName = arrayObj[i].title;
            var foodPrice = arrayObj[i].price;
            var shop_id = shopId;
            var monthSales = arrayObj[i].sales_num;
             var aRow;
            if ((i + 1) % 3 == 0) {
                console.log("hahahahah");
                 aRow = '<div class="col-md-4 cup-in" style="margin-right:0"><a href="#"><img src=\"/media/' + shopImagePath + '\" class="img-responsive" alt=""></a><p>' + foodName + '</p><span class="dollar">' + foodPrice + '</span>' + '<div class="details-in"><a href="#" class="details" data-food-id=' + foodId + ' data-shop-id=' + shop_id + '>+</a><p class="month-sales-p">月销售<span class="month-sales-span">' + monthSales + '</span>份</p></div><div class="clearfix"></div></div>';

            }else{
                console.log("22");
                 aRow = '<div class="col-md-4 cup-in"><a href="#"><img src=\"/media/' + shopImagePath + '\" class="img-responsive" alt=""></a><p>' + foodName + '</p><span class="dollar">' + foodPrice + '</span>' + '<div class="details-in"><a href="#" class="details" data-food-id=' + foodId + ' data-shop-id=' + shop_id + '>+</a><p class="month-sales-p">月销售<span class="month-sales-span">' + monthSales + '</span>份</p></div><div class="clearfix"></div></div>';

            }
            $(".cup").append(aRow);

        }
        $(".cup").append('<div class="clearfix"></div>');

    });
}

function getShoperInfo(shopId) {
    $.post("/mainpage/get_spec_shopinfo", { shop_id: shopId, csrfmiddlewaretoken:csrftoken }, function(data, status) {
        var obj = JSON.parse(data);
        var shopName = obj.shopname;
        var leastPrice = obj.least_price;
        var deliverFee = obj.deliver_fee;
        var commentScore = obj.review_score;
        var shopImage = obj.shop_img;
        var shopAddress = obj.address;
        var shopPhone = obj.cellphone;
        $(".part-detail-ul li.shop-name").text(shopName);
        $(".part-detail-ul li.illustration").text("起送价" + leastPrice + "元,配送费" + deliverFee + "元");
        $(".dropdown-content p:first").html("<b>商家地址：</b>" + shopAddress);
        $(".dropdown-content p:last").html("<b>商家联系方式：</b>" + shopPhone);
        $(".shop-detail-right-ul li:first p:first").html("<b>" + commentScore + "</b>分");
    });
}

function getLocationDescribe(){
    //获取地址
}