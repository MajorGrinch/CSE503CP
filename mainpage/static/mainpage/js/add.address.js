jQuery.addrPrepare = function(baseAddr) {
    var base_addr = baseAddr;
    var shengfen;
    var chengshi;
    var quxian;
    var jiedao;
    var youbian;
    var shouhuoren;
    var shoujihao;
    $(".add-address-label").click(function() {
        //alert("clicked");
        $("#myAddrModal").modal('show');

    });

    $(".province_select").blur(function() {
        if ($(this).get(0).selectedIndex == 0) {

            $(".selectTip").css("visibility", "visible").text("请选择省份!");
        }
    });

    $(".city_select").blur(function() {
        if ($(".province_select").get(0).selectedIndex != 0 && $(this).get(0).selectedIndex == 0) {
            $(".selectTip").css("visibility", "visible").text("请选择城市!");
        }


    });

    $(".xian_select").blur(function() {
        //alert($(".province_select").get(0).selectedIndex);
        if ($(".province_select").get(0).selectedIndex != 0 && $(".city_select").get(0).selectedIndex != 0 && $(this).get(0).selectedIndex == 0) {
            //alert("test");
            $(".selectTip").css("visibility", "visible").text("请选择区县!");
        } else if ($(".province_select").get(0).selectedIndex == 0) {
            $(".selectTip").css("visibility", "visible").text("请选择省份!");
        } else if ($(".province_select").get(0).selectedIndex != 0 && $(".city_select").get(0).selectedIndex == 0) {
            $(".selectTip").css("visibility", "visible").text("请选择城市!");
        }

    });

    $(".province_select").focus(function() {
        if ($("selectTip").val() == "请选择省份!") {
            $(".selectTip").css("visibility", "hidden");
        }
    });


    $(".city_select").focus(function() {
        if ($("selectTip").val() == "请选择城市!") {
            $(".selectTip").css("visibility", "hidden");

        }


    });

    $(".xian_select").focus(function() {
        if ($("selectTip").val() == "请选择区县!") {
            $(".selectTip").css("visibility", "hidden");
        }
    });

    $(".streetTextArea").blur(function() {
        if ($.trim($(this).val()) == "") {
            $(".streetTip").css("visibility", "visible");
        }
    });

    $(".postcodeInput").blur(function() {
        if ($.trim($(this).val()) == "") {
            $(".postcodeTip").css("visibility", "visible");
        }
    });

    $(".consigneeInput").blur(function() {
        if ($.trim($(this).val()) == "") {
            $(".consigneeTip").css("visibility", "visible");
        }
    });

    $(".phoneInput").blur(function() {
        if ($.trim($(this).val()) == "") {
            $(".phoneTip").css("visibility", "visible");
        }
    });


    $(".streetTextArea").focus(function() {
        $(".streetTip").css("visibility", "hidden");
    });

    $(".postcodeInput").focus(function() {
        $(".postcodeTip").css("visibility", "hidden");
    });

    $(".consigneeInput").focus(function() {
        $(".consigneeTip").css("visibility", "hidden");
    });

    $(".phoneInput").focus(function() {
        $(".phoneTip").css("visibility", "hidden");
    });



    $(".province_select").change(function() {
        var fname = $(this).val();

        $(".city_select").empty();
        $(".xian_select").empty();
        $('<option></option>').html("--城市--").appendTo(".city_select");
        $('<option></option>').html("--区县--").appendTo(".xian_select");

        $(".selectTip").css("visibility", "hidden");
        fname = base_addr + fname + "_city.xml";
        $.ajax({
            url: fname,
            success: function(result) {
                $(result).find("city").each(function() {
                    var cityname = $(this).find("cityname").text();
                    var citypinyin = $(this).find("citypinyin").text();
                    $('<option></option>').html(cityname).attr("value", citypinyin).appendTo(".city_select");
                });
            }
        });

    });

    $(".city_select").change(function() {
        var fname = $(this).val();

        $(".xian_select").empty();
        $('<option></option>').html("--区县--").appendTo(".xian_select");

        $(".selectTip").css("visibility", "hidden");
        fname = base_addr + fname + "_xian.xml";
        $.ajax({
            url: fname,
            success: function(result) {
                $(result).find("xian").each(function() {
                    var xianname = $(this).text();
                    $('<option></option>').html(xianname).appendTo(".xian_select");
                });
            }
        });


    });

    $(".xian_select").change(function() {
        var xianname = $(this).val();
        if (xianname != "--城市--") {
            $(".selectTip").css("visibility", "hidden");
        }
    });

    $(".addr-cancle-a").click(function(event) {
        event.preventDefault();
    });
}