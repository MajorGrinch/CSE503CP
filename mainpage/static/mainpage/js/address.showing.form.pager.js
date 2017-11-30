var show_addr_url;
var del_addr_url;
var conf_default_url;
var get_addr_count_url;
var limits=5; //每页最多展示多少条地址信息;
var show_count = 3; //页面上可选择的页码的数量；


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

function showChoosedPage(pageNumber) {
    $.post("/mainpage/show_first_page", { csrfmiddlewaretoken: csrftoken, pagenum: pageNumber, limits: limits }, function(data, status) {
        $(".customer-form tbody").empty(); //先清除表格中原有的记录，
        // data = '{"address_array":[{"id":1,"province":"福建省","city":"宁德市","county":"周宁县","street":"玛坑乡玛坑村迎祠巷6-1号","postcode":"355408","consignee":"汤林鸿","tel":"15205148560","is_default":1},{"id":2,"province":"福建省","city":"宁德市","county":"周宁县","street":"玛坑乡玛坑村迎祠巷6-1号","postcode":"355408","consignee":"汤林鸿","tel":"15205148560","is_default":0}]}';
        var obj = JSON.parse(data);
        var arrayObj = obj.address_array;
        var array_len = arrayObj.length;
        for (var i = 0; i < array_len; i++) {
            var isDefault = arrayObj[i].is_default;
            var addressId = arrayObj[i].id;
            var consignee = arrayObj[i].consignee;
            var address = arrayObj[i].province + arrayObj[i].city + arrayObj[i].county + arrayObj[i].street + " " + arrayObj[i].postcode;
            var consigneePhone = arrayObj[i].consignee_tel;
            var aRow = '<tr><td width="15%">' + consignee + '</td><td width="40%">' + address + '</td><td width="20%">' + consigneePhone + '</td><td width="25%">' + '<a href="#" class="delete_a" data-addr-id=' + addressId + '>Delete</a>';
            if (isDefault == 1) { //is default address
                aRow = aRow + '<label  class="default_label" style="margin-left:3px" data-addr-id=' + addressId + '>Default Address</label></td></tr>';

            } else {
                aRow = aRow + '<a href="#" class="config_default_a" style="margin-left:3px" data-addr-id=' + addressId + '>Set Default</a></td></tr>';

            }
            $(aRow).appendTo(".customer-form tbody");

        }
        enableOptionForForm();


    });

}

function showAddrTable(addr_total_num) {
    var page_count; //页数
    if (addr_total_num % limits == 0) {
        page_count = parseInt(addr_total_num / limits);
    } else {
        page_count = parseInt(addr_total_num / limits) + 1;
    }
    $('<table></table>').appendTo(".addr-list");
    $(".addr-list table").addClass("customer-form");
    $('<thead><tr><th>Consignee</th><th>Address</th><th>Cellphone</th><th>Operation</th></tr><<thead><tbody></tbody>').appendTo(".customer-form");
    showChoosedPage(1);
    var paginationElement = '<ul class="pagination address-form-pagination"><li class="previous-page-li"><a href="#">&laquo;</a></li>';
    if (page_count < show_count) {
        for (var j = 1; j <= page_count; j++) {
            paginationElement += '<li><a href="#">' + j + '</a></li>';
        }
    } else {
        for (var j = 1; j <= show_count; j++) {
            paginationElement += '<li><a href="#">' + j + '</a></li>';
        }
    }

    paginationElement += '<li class="next-page-li"><a href="#">&raquo;</a></li></ul>'
    $(paginationElement).appendTo(".addr-list");
    $(".address-form-pagination li:nth-child(2)").addClass("active");
    disabledPreviousAndNext(page_count);
    enablePager(page_count, show_count);
    achiveFunForPreviousAndNext(page_count, show_count);


}



function enableOptionForForm() {
    $("a.delete_a").on("click", function(event) {
        //event.preventDefault();
        var addressId = $(this).attr("data-addr-id");
        console.log("要删除的地址的id:" + addressId);
        //删除地址，传入的参数为将要删除的地址的地址ID
        $.post("/mainpage/del_addr", {
            csrfmiddlewaretoken: csrftoken,
            address_id: addressId
        }, function(data, status) {
            if (data == 1) { //delete success
                alert("Delete successfully!");

                //reload address table
                $.get("/mainpage/get_address_count", function(data, status) { //获得用户地址信息数
                    addrs_total_num = data;
                    $(".addr-list").empty();//先清除已展示的地址；
                    if (data == 0) {
                        isFirstAddress = 1;
                        $('<h5>You do not have an address. Please Add one.</h5>').appendTo(".addr-list");
                    } else {
                        showAddrTable(data);
                    }

                });
            }

        });

    });



    $("a.config_default_a").on("click",function(event) {
        // event.preventDefault();
        var defaultAddressId = $(this).attr("data-addr-id");
        alert(defaultAddressId);
        //设置默认地址，传入的参数为将要设置为默认地址的地址ID
        $.post("/mainpage/conf_default_addr", { csrfmiddlewaretoken: csrftoken, default_addr_id: defaultAddressId }, function(data, status) {
            if (data == 1) {
                alert("Set successfully!");
                $.get("/mainpage/get_address_count", function(data, status) { //get number of user address
                    addrs_total_num = data;
                    $(".addr-list").empty(); //clear address table
                    if (data == 0) {
                        isFirstAddress = 1;
                        $('<h5>You do not have an address. Please Add one.</h5>').appendTo(".addr-list");
                    } else {
                        showAddrTable(data);
                    }
                });
            }
        });
    });
}

function enablePager(page_count, show_count) {
    $(".pagination li").each(function() {
        if ($(this).hasClass("previous-page-li") == false && $(this).hasClass("next-page-li") == false) {
            $(this).click(function() {
                var active_page_num = Number($(this).children("a").html());
                console.log(active_page_num);
                showChoosedPage(active_page_num);
                $(".pagination li.active").removeClass("active");
                $(this).addClass("active");
                disabledPreviousAndNext(page_count);
            });
        }
    });
}

//判断是否需要将前一页或后一页按钮置为不可用；
function disabledPreviousAndNext(page_count) {
    if ($(".pagination li:nth-last-child(2)").hasClass("active") == true && (Number($(".pagination li:nth-last-child(2)").children("a").html()) == page_count)) {
        $(".pagination li:last").addClass("disabled");
    } else {
        $(".pagination li:last").removeClass("disabled");
    }

    if ($(".pagination li:nth-child(2)").hasClass("active") == true && (Number($(".pagination li:nth-child(2)").children("a").html()) == 1)) {
        $(".pagination li:first").addClass("disabled");
    } else {
        $(".pagination li:first").removeClass("disabled");
    }
}


function achiveFunForPreviousAndNext(page_count, show_count) {
    if (page_count <= show_count) {
        $(".previous-page-li").click(function() {
            var active_page_num = Number($(".pagination li.active").children("a").html());
            $prevLi = $(".pagination li.active").prev();
            $(".pagination li.active").removeClass("active");
            showChoosedPage(active_page_num - 1);
            $prevLi.addClass("active");
            disabledPreviousAndNext(page_count);

        });

        $(".next-page-li").click(function() {
            var active_page_num = Number($(".pagination li.active").children("a").html());
            $nextLi = $(".pagination li.active").next();
            $(".pagination li.active").removeClass("active");
            showChoosedPage(active_page_num + 1);
            $nextLi.addClass("active");
            disabledPreviousAndNext(page_count);
        });
    } else {

        $(".previous-page-li").click(function() {
            if ($(".pagination li:nth-child(2)").hasClass("active") && Number($(".pagination li:nth-child(2)").children("a").html()) > 1) {
                var active_page_num = Number($(".pagination li:nth-child(2)").children("a").html());
                showChoosedPage(active_page_num - 1);
                $(".pagination li").each(function() {
                    if ($(this).hasClass("previous-page-li") || $(this).hasClass("next-page-li")) {

                    } else {
                        var pagernumTurnTo = Number($(this).children("a").html()) - 1;
                        $(this).children("a").html(pagernumTurnTo);

                    }

                });
            } else {
                var active_page_num = Number($(".pagination li.active").children("a").html());
                $prevLi = $(".pagination li.active").prev();
                $(".pagination li.active").removeClass("active");
                showChoosedPage(active_page_num - 1);
                $prevLi.addClass("active");
            }

            disabledPreviousAndNext(page_count);
        });

        $(".next-page-li").click(function() {
            if ($(".pagination li:nth-last-child(2)").hasClass("active") == true && Number($(".pagination li:nth-child(2)").children("a").html()) < page_count) {
                var active_page_num = Number($(".pagination li:nth-child(2)").children("a").html());
                showChoosedPage(active_page_num + 1);
                $(".pagination li").each(function() {
                    if ($(this).hasClass("previous-page-li") || $(this).hasClass("next-page-li")) {

                    } else {

                        var pagernumTurnTo = Number($(this).children("a").html()) + 1;
                        $(this).children("a").html(pagernumTurnTo);

                    }
                });



            } else {
                var active_page_num = Number($(".pagination li.active").children("a").html());
                $nextLi = $(".pagination li.active").next();
                $(".pagination li.active").removeClass("active");
                showChoosedPage(active_page_num + 1);
                $nextLi.addClass("active");
            }

            disabledPreviousAndNext(page_count);
        });
    }



}