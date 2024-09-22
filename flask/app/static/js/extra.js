$(function() {
    $("#arbeit_chart").css("display", "none");
    $("#franchise_chart").css("display", "none");
    $("#arbeit").css("height", "150px");
    $("#franchise").css("height", "150px");
    $("#real_estate").css("height", "270px");

    $("#commercial_area").keyup(function() {
        if($("#commercial_area").val() != "")
            detail_area_list();
        
        if($("#commercial_area").val() == "" && $("#detail_commercial_area").length > 0) {
            $("#detail_commercial_area li").remove();
            $(".area_list").css("display", "none");
        }
    });
    
    $("#detail_commercial_area").on("click", "li", function() {
        $("#commercial_area").val($(this).text());
    
        upjong_list($(this).text());
    });
    
    $("#btn_search").click(function() {
        if($("#commercial_area").val() == "") {
            alert("상권명을 입력하세요.");
    
            $("#commercial_area").focus();
        }
    
        if($("#upjong").val() == "") {
            alert("업종을 선택하세요.");
        }

        $(".area_list").css("display", "none");

        $commercial_area = $("#commercial_area").val();
        $upjong = $("#upjong").val();
    
        // 데이터 가져오기
        get_extra_datas($commercial_area, $upjong);
    });

    $("#btn_estate").click(function() {
        if($("#commercial_area").val() == "") {
            alert("상권명을 입력하세요.");
    
            $("#commercial_area").focus();
        }

        get_real_estate();
    });

    $("#parking").change(function() {
        // if(!$("#item_list").is(":empty")) {
        console.log($("#item_list").length);

        if($("#item_list").length != 0) {
        // if($("#item_list > li").size() != "0") {
            get_real_estate();
        }
    });
});

function draw_day(data) {
    let canvas_day = $("#canvas_day");
    let day_chart = new Chart(canvas_day, {
        type: "pie",
        data: {
            labels: [
                "월요일", 
                "화요일", 
                "수요일", 
                "목요일",
                "금요일",
                "토요일",
                "일요일"
            ], 
            datasets: [{
                data: [
                    data["월요일_매출_비율"],
                    data["화요일_매출_비율"],
                    data["수요일_매출_비율"],
                    data["목요일_매출_비율"],
                    data["금요일_매출_비율"],
                    data["토요일_매출_비율"],
                    data["일요일_매출_비율"],
                ], 
                
                backgroundColor: [
                    "#b3cde0",
                    "#4a7da7",
                    "#6497b1",
                    "#215b7a",
                    "#10496E",
                    "#03396c",
                    "#011f4b"
                ], 
                borderWidth: 0
            }]
        }, 
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}


function draw_time(data) {
    let canvas_time = $("#canvas_time");
    let time_chart = new Chart(canvas_time, {
        type: "pie",
        data: {
            labels: [
                "00~06시", 
                "06~11시", 
                "11~14시", 
                "14~17시",
                "17~21시",
                "21~24시"
            ], 
            datasets: [{
                data: [
                    data["시간대_00~06_매출_비율"],
                    data["시간대_06~11_매출_비율"],
                    data["시간대_11~14_매출_비율"],
                    data["시간대_14~17_매출_비율"],
                    data["시간대_17~21_매출_비율"],
                    data["시간대_21~24_매출_비율"]
                ],
                backgroundColor: [
                    "#b3cde0",
                    "#4a7da7",
                    "#6497b1",
                    "#215b7a",
                    "#03396c",
                    "#011f4b"
                ], 
                borderWidth: 0
            }]
        }, 
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}


// 안정성
function draw_stability(data) {
    let canvas_stability = $("#canvas_stability");
    let stability_chart = new Chart(canvas_stability, {
        type: "pie",
        data: {
            labels: [
                "자기자본비율(자본/자산)", "부채비율(부채/자본)"
            ], 
            datasets: [{
                data: [
                    data["자기자본비율(자본/자산)"],
                    data["부채비율(부채/자본)"]
                ], 
                
                backgroundColor: [
                    "#b3cde0",
                    "#03396c"
                ], 
                borderWidth: 0
            }]
        }, 
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


// 수익성
function draw_profitability(data) {
    let canvas_profitability = $("#canvas_profitability");
    let profitability_chart = new Chart(canvas_profitability, {
        type: "pie",
        data: {
            labels: [
                "영업이익률(영업이익/매출액)", "자기자본 순이익률(당기순이익/자본)"
            ], 
            datasets: [{
                data: [
                    data["영업이익률(영업이익/매출액)"],
                    data["자기자본 순이익률(당기순이익/자본)"]
                ], 
                
                backgroundColor: [
                    "#b3cde0",
                    "#03396c"
                ], 
                borderWidth: 0
            }]
        }, 
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


function reset_canvas() {
    $("#canvas_day").remove();
    $("#canvas_time").remove();
    $("#canvas_stability").remove();
    $("#canvas_profitability").remove();

    $("#day").append("<canvas id='canvas_day'></canvas>");
    $("#time").append("<canvas id='canvas_time'></canvas>");
    $("#stability").append("<canvas id='canvas_stability'></canvas>");
    $("#profitability").append("<canvas id='canvas_profitability'></canvas>");
}


function detail_area_list() {
    let $target = $("#detail_commercial_area");

    $(".area_list").css("display", "block");

    $.ajax({
        url: "/extra/commercial-area-list",
        type: "POST",
        data: {"name": $("#commercial_area").val()},
        success: function(result) {
            $target.empty();

            for(let i=0; i<result.length; i++) {
                key = result[i]["상권_코드"];
                val = result[i]["상권_코드_명"];

                $target.append("<li value='"+key+"' class='add_li'>"+val+"</li>");
                $target.animate({scrollTo: $target.prop("scrollHeight")}, 500);
            }

            $(".add_li:nth-child("+result.length+")").css("border-bottom", "none");
        }
    });
}


function upjong_list() {
    let $target = $("#upjong");

    $.ajax({
        url: "/extra/upjong_list",
        type: "POST",
        data: {"name": $("#commercial_area").val()},
        success: function(result) {
            $target.empty();

            for(let i=0; i<result.length; i++) {
                $target.append("<option value='"+result[i][0]+"'>"+result[i][1]+"</option>");
            }

            $("#upjong option:eq(0)").prop("selected", true);
        }
    });
}

function get_extra_datas($commercial_area, $upjong) {
    $.ajax({
        url: "/extra/datas",
        type: "POST",
        data: {"name": $commercial_area, "upjong": $upjong},
        success: function(result) {
            for(let i=0; i<result.length; i++) {
                console.log(result[i]);
            }

            reset_canvas();

            draw_day(result[0]);
            draw_time(result[1]);

            let days = [
                result[0]["월요일_매출_비율"],
                result[0]["화요일_매출_비율"],
                result[0]["수요일_매출_비율"],
                result[0]["목요일_매출_비율"],
                result[0]["금요일_매출_비율"],
                result[0]["토요일_매출_비율"],
                result[0]["일요일_매출_비율"]
            ];

            let times = [
                result[1]["시간대_00~06_매출_비율"],
                result[1]["시간대_06~11_매출_비율"],
                result[1]["시간대_11~14_매출_비율"],
                result[1]["시간대_14~17_매출_비율"],
                result[1]["시간대_17~21_매출_비율"],
                result[1]["시간대_21~24_매출_비율"]
            ];

            let days_dict = {
                "0": "월요일", 
                "1": "화요일", 
                "2": "수요일", 
                "3": "목요일",
                "4": "금요일",
                "5": "토요일",
                "6": "일요일"
            }

            let times_dict = {
                "0": "00~06시", 
                "1": "06~11시", 
                "2": "11~14시", 
                "3": "14~17시",
                "4": "17~21시",
                "5": "21~24시"
            }

            let max_day = Math.max.apply(null, days);
            let max_time = Math.max.apply(null, times);

            let max_day_index = days.indexOf(max_day);
            let max_time_index = times.indexOf(max_time);

            temp_str = "<p class='p_result'>";
            temp_str += result[0]["상권_코드_명"]+" 상권의 "+result[0]["서비스_업종_코드_명"]+" 업종은<br>";
            temp_str += "평균적으로 <b>"+days_dict[max_day_index]+"</b>과 <b>"+times_dict[max_time_index]+"</b>에 ";
            temp_str += "손님이 가장 많습니다.</p>";

            $("#arbeit_chart").css("display", "block");
            $("#franchise_chart").css("display", "block");
            $("#arbeit").css("height", "600px");

            $("#arbeit .p_result").remove();
            $("#arbeit").append(temp_str);

            $("#franchise .p_result").remove();

            if(Array.isArray(result[3])) {
                $("#franchise").css("height", "770px");
                $("#franchise").append("<p style='text-align:center;font-size:13px;>단위: 천원</p>");

                franchise_str = "<p class='p_result'>";
                franchise_str += result[0]["상권_코드_명"]+" 상권에서 매출 증감률이 <b>";
                franchise_str += result[2]["전년도비_매출_증감률"]+"%</b>로 가장 높은 <b>";
                franchise_str += result[2]["서비스_업종_코드_명"]+"</b>의 프랜차이즈 정보</p>";

                console.log(result[3][0]["상호"]);
                console.log(result[3][1]["상호"]);
                franchise_str2 = "<p class='p_result'><b>"+result[3][0]["상호"]+"</b> 가맹본부<br>";
                franchise_str2 += "부채: "+result[3][0]["부채"].toLocaleString()+", ";
                franchise_str2 += "자본: "+result[3][0]["자본"].toLocaleString()+", ";
                franchise_str2 += "자산: "+result[3][0]["자산"].toLocaleString()+"<br>";
                franchise_str2 += "부채비율, 자기자본비율 기준으로 <b>안정성</b>이 가장 높다.</p>";

                franchise_str3 = "<p class='p_result'><b>"+result[3][1]["상호"]+"</b> 가맹본부<br>";
                franchise_str3 += "당기순이익: "+result[3][1]["당기순이익"].toLocaleString()+", ";
                franchise_str3 += "매출액: "+result[3][1]["매출액"].toLocaleString()+", ";
                franchise_str3 += "영업이익: "+result[3][1]["영업이익"].toLocaleString()+'<br>';
                franchise_str3 += "영업이익률, 자기자본 순이익률 기준으로 <b>수익성</b>이 높다.</p>";

                $("#franchise_chart").before(franchise_str);
                $("#franchise").append(franchise_str2);
                $("#franchise").append(franchise_str3);

                draw_stability(result[3][0]);
                draw_profitability(result[3][1]);
            } else {
                $("#franchise_chart").css("display", "none");
                $("#franchise").css("height", "270px");

                franchise_str = "<p class='p_result'>";
                franchise_str += result[0]["상권_코드_명"]+" 상권에서 매출 증감률이 <b>";
                franchise_str += result[2]["전년도비_매출_증감률"]+"%</b>로 가장 높은 <b>";
                franchise_str += result[2]["서비스_업종_코드_명"]+"</b> 업종과 관련된 프랜차이즈가 없습니다.";
                
                $("#canvas_stability").remove();
                $("#canvas_profitability").remove();

                $("#franchise_chart").before(franchise_str);
            }
        }
    });
}

function get_real_estate() {
    let $dealing_way = $("#dealing_way").val();
    let $price = $("#price").val();
    let $parking;

    if($("input:checkbox[id='parking']").is(":checked")) {
        $parking = "가능";
    } else {
        $parking = "total";
    }

    $("#item_list li").remove();
    $("#real_estate .p_result").remove();

    $.ajax({
        url: "/extra/real-estate",
        type: "POST",
        data: {
            "name": $("#commercial_area").val(),
            "way": $dealing_way, 
            "price": $price, 
            "parking": $parking
        },
        success: function(result) {
            console.log(result);

            if(result.length > 0) {
                $("#real_estate").css("height", "700px");
                $("#item_list").css("display", "block");
                // $("#item_list").css("height", "650px");
                $("#item_list").css("height", "auto");
                $("#item_list").css("max-height", "480px");
                $("#item_list").css("background-color", "white");

                // $("#real_eatate").css("height", "auto");
                $("#real_estate h4").remove();
                $("#item_list").before("<h4 style='margin-top:40px;text-align:center;'>"+result[0]["소재지"]+"</h3>");

                for(let i=0; i<result.length; i++) {
                    li_str = "<li><p><span class='li_title'>"+result[i]["가격"]+"</span>";
                    li_str += "<span class='li_title'>"+result[i]["거래방식"]+"</span></p>";
                    li_str += "<p><span class='li_content'>계약/전용 면적: "+result[i]["계약/전용면적"]+"</span>";
                    li_str += "<span class='li_content'>해당층/총층: "+result[i]["해당층/총층"]+"</span></p>";
                    li_str += "<p><span class='li_content'>주차 가능 여부: "+result[i]["주차가능여부"]+"</span>";
                    li_str += "<span class='li_content'>방향: "+result[i]["방향"]+"</span></p>";
                    li_str += "<p><span class='li_content'>"+result[i]["매물특징"]+"</span></p></li>";

                    $("#item_list").append(li_str);
                }

                $("#item_list li:nth-child("+result.length+")").css("border-bottom", "none");
            } else {
                $("#real_estate").css("height", "270px");
                $("#item_list").css("display", "none");
                // $("#item_list").css("background-color", "none");
                $("#real_estate").append("<p class='p_result'>조건에 해당하는 부동산 데이터가 없습니다.</p>");
            }
        }
    });
}

function modal(x) {
    $("#modal_on").css("display", x);
}
