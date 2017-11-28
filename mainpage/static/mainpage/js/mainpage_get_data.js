var shop_limit = 6;
var cur_page;

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

function getShopInfoBySalesOrComments(condition, pagenum) {
    if (pagenum >= 1) {
        var success = true; //标志数据库中是否存在该所需页,在底下的条件中当未取到数据时设置success=false,并进行提醒
        switch (condition) {
            case "sales":
                $.post("/mainpage/show_shops_orderby_sales",{page_num:pagenum,limits:6, csrfmiddlewaretoken: csrftoken},function(data,status){
                    displayShop(data);

                });
                break;
            case "Rating":
                alert("Rating");
                break;

        }
        if (success) {
            cur_page = pagenum;
        }
    }
}

function getShopInfoByLeastPrice(price, pagenum) {
    if (pagenum >= 1) {
        var success = true; //标志数据库中是否存在该所需页,在底下的条件中当未取到数据时设置success=false，并进行提醒
        if (price == "全部商家") {
           // alert("全部商家");

        } else {
            switch (price) {
                case "10":
                   // alert("10");

                    break;
                case "20":
                   // alert("20");
                    break;
                case "30":
                    //alert("30");
                    break;
            }


        }
        if (success) {
            cur_page = pagenum;

        }

    }
}

function getShopInfoForNextByLeastPrice(condition) {
    getShopInfoByLeastPrice(condition,cur_page+1);

}

function getShopInfoForPrevByLeastPrice(condition) {
    getShopInfoByLeastPrice(condition,cur_page-1);

}

function getShopInfoForNextBySalesOrComments(condition) {
    getShopInfoBySalesOrComments(condition,cur_page+1);

}

function getShopInfoForPrevBySalesOrComments(condition) {
    getShopInfoBySalesOrComments(condition,cur_page-1);

}

function displayShop(data){//data为json字符串；
    var obj=JSON.parse(data);
    var arrayObj=obj.shopArray;
    console.log(arrayObj);
    var arrayLen=arrayObj.length;
    $(".cup").empty();
    for(var i=0;i<arrayLen;i++){
        var shopId=arrayObj[i].id;
        var shopImagePath=arrayObj[i].shop_img;
        var shopName=arrayObj[i].shopname;
        var shopDeliverFee=arrayObj[i].deliver_fee;
        var shopLeastPrice=arrayObj[i].least_price;
        var shopReviewScore=arrayObj[i].review_score;
        var shopSalesTotalNum=arrayObj[i].sales_num;//注意此字段不能直接从shop表中得到，需要进行表连接操作进行获取；
        var aRow;
        console.log(shopName);
        if((i+1)%3==0){
             aRow='<div class="col-md-4 cup-in" style="margin-right:0"><a href="#" data-shop-id='+shopId+'><img src=\"/media/'+shopImagePath+'\" class="img-responsive" alt=""></a><p>'
                 +shopName+'</p><div class="mainpage-num-data"><p class="mainpage-sales-num">Sold<span class="sales-num">'+shopSalesTotalNum+'</span></p><p class="mainpage-score-comment">Rating<span class="score-comment">'
                 +shopReviewScore+'</span>point</p></div><div class="details-in"><p>least price<span class="deliver-min-price">'+shopLeastPrice+'</span>$, delivery fee<span class="deliver_fee">'
                 +shopDeliverFee+'</span>$</p></div><div class="clearfix"></div></div>';


        }else{
            aRow='<div class="col-md-4 cup-in"><a href="#" data-shop-id='+shopId+'><img src=\"/media/'+shopImagePath+'\" class="img-responsive" alt=""></a><p>'
                 +shopName+'</p><div class="mainpage-num-data"><p class="mainpage-sales-num">Sold<span class="sales-num">'+shopSalesTotalNum+'</span></p><p class="mainpage-score-comment">Rating<span class="score-comment">'
                 +shopReviewScore+'</span>points</p></div><div class="details-in"><p>least price<span class="deliver-min-price">'+shopLeastPrice+'</span>$, delivery fee<span class="deliver_fee">'
                 +shopDeliverFee+'</span>$</p></div><div class="clearfix"></div></div>';


        }
         $(".cup").append(aRow);
    }
    $(".cup").append('<div class="clearfix"></div>');
}

function queryShop(keywords){//根据顶部搜索栏的搜索词进行搜索
    console.log("come query function");
    $.post("/mainpage/get_shop_by_keywords",{csrfmiddlewaretoken: csrftoken,keyword:keywords},function(data,status){
        if(data!=0){//当有符合搜索条件的结果时返回JSON字符串，否则返回0
            displayShop(data);
        }else{
            alert("对不起，找不到您要的美食哦！");
        }
    });

}

function comeToSpecificShop(shop_id){
    //传进商店id，根据商店id获得商店信息，然后转入商家页面；
    //alert(shop_id);
    $.post("/mainpage/shop_detail",{csrfmiddlewaretoken: csrftoken,shop_id:shop_id});
}



