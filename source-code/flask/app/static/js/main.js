$(function() {
    $(".btn_side").click(function() {
        $("#side_bar").css("display", "block");
    });

    $(".btn_side_close").click(function() {
        $("#side_bar").css("display", "none");
    });

    // $("#market").change()
});

var result;

function modal(x) {
    $("#modal_on").css("display", x);
}

function make_pie(input) {
    // var gender = document.getElementById('gender_ratio').getContext('2d');
    let gender = $("#gender_ratio");
    let genderChart = new Chart(gender, {
        type: 'doughnut',
        data: {
            labels: ['남성','여성'],
            datasets: [{
                label: 'gender_ratio',
                data: input,
                backgroundColor: [
                    '#0367A6',
                    '#D9848B',
                ],
                borderWidth: 1,
                borderColor: '#f0f0f0',
                hoverBorderWidth: 4,
            }],
            scaleBeginAtZero: true
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: '남녀 매출 비중 (단위:%)',
                    fontsize: 10,
                },
                legend :{
                    display: true,
                    position:'right',
                },
                tooltips: {
                    enabled: true,
                },
                layout: {
                    top: 10,
                    left: 10
                },
                pieceLabel: {
                    mode: "label",
                    position: "inside",
                    fontSize: 11,
                    fontStyle: "bold"
                }
            }
        }
    })
}

function make_age(input) {
    // var age = document.getElementById('age_ratio').getContext('2d');
    let age = $("#age_ratio");
    let ageChart = new Chart(age, {
        type: 'doughnut',
        data: {
            labels: ['10대','20대','30대','40대','50대','60대 이상'],
            datasets: [{
                label: 'gender_ratio',
                data: input,
                backgroundColor: [
                    "#b3cde0",
                    "#4a7da7",
                    "#6497b1",
                    "#215b7a",
                    "#03396c",
                    "#011f4b"
                ],
                borderWidth: 1,
                borderColor: '#f0f0f0',
                hoverBorderWidth: 4
            }],
            scaleBeginAtZero: true,
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: '연령별 매출 비중 (단위:%)',
                    fontsize: 10,
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {   
                        boxWidth: 20,
                        boxHeight:10
                    }
                },
                tooltips: {
                    enabled: true,
                },
                layout: {
                    top:10,
                    left:10
                }
            }
        }
    })
}

function make_bar(input) {
    // var sales = document.getElementById('day_ratio').getContext('2d');
    let sales = $("#day_ratio");
    let salesChart = new Chart(sales, {
        type: 'bar',
        data: {
            labels: ['월','화','수','목','금','토','일'], 
            datasets:[{
                data: input,
                backgroundColor:[
                    "#6497b1"
                ],
                borderWidth: 1,
                borderColor: '#f0f0f0',
                hoverBorderWidth: 4,    
            }]
        },
        options: {
            responsive: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                    }
                },
                y: {
                    grid: {
                        display:false
                    }
                }
            },
            plugins: {
                title: {
                    display:true,
                    text:"일별 매출 비중 (단위:%)",
                    fontSize:10
                },
                legend :{
                    display: false,
                    position:'top',
                },
                tooltips: {
                    enabled: true,
                },
                layout: {
                    top:10,
                    bottom: 10
                }
            }
        }
    })
}
//fourth
function make_service(input) {
    let years = []
    let datas = []

    for(let i=0; i<input.length; i++) {
        if(input[i]["기준_년_코드"] == "2021")
            break;
            
        years.push(input[i]["기준_년_코드"]);
        datas.push(input[i]["년_매출_합"]);
    }

    console.log(years);
    console.log(datas);

    // var sales = document.getElementById('day_ratio').getContext('2d');
    let service = $("#service_sale");
    let serviceChart = new Chart(service, {
        type: 'bar',
        data: {
            labels: years, 
            datasets:[{
                data: datas,
                backgroundColor:[
                    "#6497b1"
                ],
                borderWidth: 1,
                borderColor: '#f0f0f0',
                hoverBorderWidth: 4,    
            }]
        },
        options: {
            responsive: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                    }
                },
                y: {
                    grid: {
                        display:false
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text:"연 매출 합 (단위:원)",
                    fontSize:10
                },
                legend :{
                    display: false,
                    position:'top',
                },
                tooltips: {
                    enabled: true,
                },
                layout: {
                    top:10,
                    bottom: 10
                }
            }
        }
    })
}
// market_name
function market_code(value) {
    $.ajax({
        type:'POST',
        url:'/market-name',
        data:{'code':value},
        success: function(res){
            let service_code = res;
            let $target = $("select[name='ctg_name']");
            $target.empty();
            $target.append("<option value=''>선택</option>")
            $.ajax ({
                type:'POST',
                url:'/market-name/list',
                data:{'code':service_code},
                success: function(temp){
                    result = temp;
        
                    for(let i=0; i<result[0].length;i++){
                        $target.append("<option value='"+i+"'>"+result[0][i]['서비스_업종_코드_명']+"</option>");
                    }
                    
                    console.log(result);
        
                    // for(let i=0; i<res.length; i++) {
                    //     console.log(res[i]);
                    // }
                }
            })
        }
    })
}

function resetCanvas() {
    $('#gender_ratio').remove();
    $('#age_ratio').remove();
    $('#day_ratio').remove();
    $('#service_sale').remove();

    $('#first').append('<canvas id="gender_ratio" width="400" height="250"></canvas>');
    $('#second').append('<canvas id="age_ratio" width="400" height="250"></canvas>');
    $('#third').append('<canvas id="day_ratio" width="400" height="250"></canvas>');
    $('#fourth').append('<canvas id="service_sale" width="400" height="250"></canvas>');
}

function get_service_list(value) {
    resetCanvas();

    make_pie([result[0][value]['남성_매출_비율'],result[0][value]['여성_매출_비율']]);
    make_age([
        result[1][value]['연령대_10_매출_비율'],
        result[1][value]['연령대_20_매출_비율'],
        result[1][value]['연령대_30_매출_비율'],
        result[1][value]['연령대_40_매출_비율'],
        result[1][value]['연령대_50_매출_비율'],
        result[1][value]['연령대_60_이상_매출_비율']
    ]);
    make_bar([
        result[2][value]['월요일_매출_비율'],
        result[2][value]['화요일_매출_비율'],
        result[2][value]['수요일_매출_비율'],
        result[2][value]['목요일_매출_비율'],
        result[2][value]['금요일_매출_비율'],
        result[2][value]['토요일_매출_비율'],
        result[2][value]['일요일_매출_비율']
    ]);

    $.ajax({
        type:'POST',
        url:'/market-name/list/service',
        data:{
            "market_code":result[1][value]['상권_코드'],
            "service_code":result[1][value]['서비스_업종_코드']
        },
        success: function(res){
            console.log(res);

            make_service(res);
        }
    })
}