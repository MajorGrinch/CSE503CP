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

function recalculateTotalPrice($table) {

    var totalPrice = 0;
    $table.children("tbody").children("tr").each(function() {
        var count = parseInt($(this).find("span.count").text());
        var singlePrice = parseInt($(this).find("span.dollar").text());
        totalPrice += count * singlePrice;
    });
    var deliverFee = parseInt($table.find("span.deliver-dollar").text());
    totalPrice += deliverFee;
    $table.find("span.total-price").text(totalPrice);
}

function recalculateTotalPriceByGoodCountInputChange($goodCountInput) {
    $goodCountInput.parents("tr").find("span.count").text($goodCountInput.val());
    recalculateTotalPrice($goodCountInput.parents("table"));


}


var total_price;

function initialTable() {
    //从cache中加载数据，然后初始化所有表格；
    total_price = 0;
    $(".shoppingcar-container").empty();
    $.get("/mainpage/get_cart", function(data, status) {
        if (data == 0) {
            $(".shoppingcar-container").append("<p>购物车为空</p>");
        } else {
            var obj = JSON.parse(data);
            var arrayObj = obj.shoppingcar_array;
            var shop_info = obj.shop_info;
            var arrayLen = arrayObj.length;
            var itemsObj;
            var shopId;
            var shopName;
            var shopDeliverFee;
            for (var shop_id in arrayObj) {
                shopId = shop_id;
                itemsObj = arrayObj[shopId];
                shopName = shop_info[shopId].shopname;
                shopDeliverFee = shop_info[shopId].deliver_fee;
                console.log(shopName);
                $('<table id="customers" data-shop-id=' + shopId + '><thead><th colspan="3" class="shop-name-th">' + shopName + '</th></thead><tbody></tbody>').appendTo(".shoppingcar-container");
                var $tableBody = $(".shoppingcar-container #customers:last").find("tbody");
                for (var kk in itemsObj) {
                    var merchId = kk;
                    var merchanCount = itemsObj[kk].cnt;
                    var foodPrice;
                    var foodName;
                    var foodImg;
                    var aRow;
                    foodPrice = itemsObj[kk].price;
                    foodName = itemsObj[kk].food_name;
                    foodImg = itemsObj[kk].food_img;
                    aRow = '<tr><td width="60%" colspan="2" class="description"><ul><li><img data-food-id=' + merchId + ' src=\"/media/' + foodImg + '\"  class="food-img"></li><li><div class="shoppingcar-description"><p>' + foodName + '</p><p><span class="count">' + merchanCount + '</span><span class="multiply">x</span><span class="dollar">' +
                        foodPrice + '</span></p></div></li></ul></td><td width="40%" class="operation"><ul><li><button class="decrease">-</button><input class="good-count" type="text" value=' + merchanCount + '></input><button class="plus">+</button></li><li class="delete-li"><button class="btn btn-danger delete">删除</button></li></ul></td></tr>';
                    $tableBody.append(aRow);
                    //  total_price += foodPrice * merchanCount;


                }
                // total_price += shopDeliverFee;
                var aFooter = '<tfoot><tr><td colspan="3"><div class="total-price-div"><h4><b>总价:</b><span class="dollar total-price"></span></h4></div><div class="clearfix"></div><p><b>+配送费</b><span class="deliver-dollar">' + shopDeliverFee + '</span>元</p></td></tr><tr><td colspan="3"><ul><li><button class="btn btn-info ensure-btn" >确定下单</button></li><li><button class="btn btn-link cancel-btn">取消</button></li></ul></td></tr>';
                // var aFooter = '<tfoot><tr><td colspan="3"><div class="total-price-div"><h4><b>总价:</b><span class="dollar total-price">' + total_price + '</span></h4></div><div class="clearfix"></div><p><b>+配送费</b><span class="deliver-dollar">' + shopDeliverFee + '</span>元</p></td></tr><tr><td colspan="3"><ul><li><button class="btn btn-info" onclick=\"place_order(' + shop_id + ',' + total_price + ')\">确定下单</button></li><li><button class="btn btn-link cancel">取消</button></li></ul></td></tr>';
                $(".shoppingcar-container #customers:last").append(aFooter);
                // total_price = 0;
            }
            $("span.multiply").after('<span class="renminbi">¥</span>');
            $("span.total-price").before('<span class="renminbi">¥</span>');

            $(".plus").on("click", function() {
                var currentCount = parseInt($(this).prev().val()) + 1;
                var goodId=$(this).parents("tr").find(".food-img").attr("data-food-id");


                $(this).prev().val(currentCount);
                $(this).parents("td").siblings().find("span.count").text(currentCount);
                recalculateTotalPrice($(this).parents("table"));
                $
            });

            $(".decrease").on("click", function() {
                if ($(this).next().val() == 1) {

                } else {
                    var currentCount = parseInt($(this).next().val()) - 1;
                    var goodId=$(this).parents("tr").find(".food-img").attr("data-food-id");


                    $(this).next().val(currentCount);
                    $(this).parents("td").siblings().find("span.count").text(currentCount);
                    recalculateTotalPrice($(this).parents("table"));

                }
            });

            $(".delete").on("click", function() {
                var goodId=$(this).parents("tr").find(".food-img").attr("data-food-id");
                //根据goodId删除cache中与该商品相关的数据


                var $table = $(this).parents("table");
                var isEmpty = checkTableEmpty($table);
                if (isEmpty == false) {
                    $(this).parents("tr").remove();
                    recalculateTotalPrice($table);
                }
            });

            $(".good-count").on("change", function() {
                var currentCount=parseInt($(this).val());
                var goodId=$(this).parents("tr").find(".food-img").attr("data-food-id");

                recalculateTotalPriceByGoodCountInputChange($(this));
            });

            $(".ensure-btn").click(function() {
                $table = $(this).parents("table");
                var shopId = $table.attr("data-shop-id");
                var totalPrice = $table.find("span.total-price").text();

                $.post("place_order", { csrfmiddlewaretoken: csrftoken, shop_id: shopId, total_price: totalPrice },
                    function(data, status) {
                        if (data == 1) {
                            location.reload();
                        }
                    });


            });

            $(".cancel-btn").click(function() {
                var shopId=$(this).parents("table").attr("data-shop-id");
                //根据shopId删除cache中与某一商店相关的所有数据；


                cancelOrder($(this).parents("table"));

            });

            //计算每个table的价格
            $("table").each(function() {
                //重新计算table的价格
                recalculateTotalPrice($(this));
            });

        }



    });


}

function checkTableEmpty($table) {
    if ($table.find("tbody tr").length == 1) {
        $table.remove();
        return true;
    }
    return false;
}

function cancelOrder($table) {
    $table.remove();
    if ($(".shoppingcar-container").find("table").length == 0) {
        $(".shoppingcar-container").append("<p>购物车为空</p>");

    }
}



// function place_order(shop_id, totalprice) {
//     $.post("place_order", { csrfmiddlewaretoken: csrftoken, shop_id: shop_id, total_price: totalprice },
//         function(data, status) {
//             alert("here");
//             if (data == 1) {
//                 location.reload();
//             }
//         });
// }