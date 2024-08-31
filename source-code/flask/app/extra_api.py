from flask import Blueprint, request, render_template, jsonify
from pymongo import MongoClient
from pprint import pprint

extra = Blueprint("extra", __name__)

connection = MongoClient("mongodb+srv://user1:uZGuuMyRngM3izgG@cluster0.cu0c3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", connect=False)
db = connection.get_database("elice")

@extra.route("/extra")
def extra_page():
    return render_template("extra.html")


@extra.route("/extra/commercial-area-list", methods=["POST"])
def extra_commercial_area_list():
    value = request.form.get("name")
    
    commercial_area = db.get_collection("commercial_area")
    
    query = {"상권_코드_명": {"$regex": value}}
    projection = {"_id": False}
    
    commercial_areas = commercial_area.find(query, projection)

    return jsonify(list(commercial_areas))


@extra.route("/extra/upjong_list", methods=["POST"])
def extra_upjong_list():
    value = request.form.get("name")
    result = []

    sales_rate_day = db.get_collection("sales_rate_day")

    query = {"상권_코드_명": value}
    projection = {"_id": False, "서비스_업종_코드": True, "서비스_업종_코드_명": True}

    for data in sales_rate_day.find(query, projection):
        result.append((data["서비스_업종_코드"], data["서비스_업종_코드_명"]))

    return jsonify(result)


@extra.route("/extra/datas", methods=["POST"])
def extra_datas():
    name = request.form.get("name")
    upjong = request.form.get("upjong")

    result = []

    sales_rate_day = db.get_collection("sales_rate_day")
    sales_rate_time = db.get_collection("sales_rate_time")

    query1 = {"상권_코드_명": name, "서비스_업종_코드": upjong}
    projection1 = {"_id": False}

    # 요일별 매출 비율
    result.append(sales_rate_day.find_one(query1, projection1))

    # 시간대별 매출 비율
    result.append(sales_rate_time.find_one(query1, projection1))

    # 상권코드명으로 상권코드 가져오기
    commercial_area = db.get_collection("commercial_area")
    
    query2 = {"상권_코드_명": name}
    projection2 = {"_id": False, "상권_코드": True}

    code = commercial_area.find_one(query2, projection2)["상권_코드"]

    # 프랜차이즈
    # 매출이 가장 높은 업종
    sales_info_service = db.get_collection("sales_info_service")

    query3 = {"상권_코드": code, "기준_년_코드": 2020}
    projection3 = {"_id": False, "상권_코드": True, "서비스_업종_코드_명": True, "전년도비_매출_증감률": True}

    # result.append(list(sales_info_service.find(query3, projection3).sort("전년도비_매출_증감률", -1).limit(1)))

    for data in sales_info_service.find(query3, projection3).sort("전년도비_매출_증감률", -1).limit(1):
        top_sales_upjong = data

    upjong_code = top_sales_upjong["서비스_업종_코드_명"]

    result.append({
        "서비스_업종_코드_명": upjong_code,
        "전년도비_매출_증감률": top_sales_upjong["전년도비_매출_증감률"]
    })

    upjong_dict = {
        "한식음식점": "한식",
        "분식전문점": "분식",
        "중식음식점": "중식", 
        "일식음식점": "일식",
        "양식음식점": "서양식",
        "패스트푸드점": "패스트푸드",
        "치킨전문점": "치킨",
        "제과점": "제과제빵",
        "커피-음료": "커피",
        "호프-간이주점": "주점",
        "편의점": "편의점",
        "미곡판매":"농수산물",
        "PC방": "PC방",
        "가방": "패션",
        "노래방": "오락",
        "미용실": "이미용",
        "볼링장": "오락",
        "부동산중개업": "부동산 중개",
        "고시원": "숙박",
        "독서실": "기타도소매",
        "골프연습장": "임대",
        "비디오/서적임대": "임대",
        "세탁소": "세탁",
        "수산물판매": "농수산물",
        "슈퍼마켓": "종합소매점",
        "반찬가게": "기타도소매",
        "스포츠 강습": "스포츠 관련",
        "스포츠클럽": "스포츠 관련",
        "신발": "패션",
        "안경": "안경",
        "애완동물": "반려동물 관련",
        "여관": "숙박",
        "외국어학원": "외국어 교육",
        "운동/경기용품": "스포츠 관련",
        "육류판매": "농수산물",
        "의약품": "약국",
        "일반교습학원": "교과 교육",
        "일반의류": "패션",
        "자동차미용": "자동차 관련",
        "자동차부품": "자동차 관련",
        "자동차수리": "자동차 관련",
        "한복점": "종합도소매", 
        "핸드폰": "기타도소매",
        "화장품": "화장품",
        "문구": "기타도소매",
        "완구": "기타도소매"
    }

    franchise = db.get_collection("franchise2")

    if upjong_code in upjong_dict:
        upjong_code = upjong_dict[upjong_code]
    else:
        result.append(upjong_code)

    if isinstance(result[-1], dict):
        condition = "가맹본부별"
        sub_conditions = ["안정성", "수익성"]

        temp = []

        # for condition in conditions:
        for sub_condition in sub_conditions:
            query4 = {"비교 항목": condition, "세부 비교 항목": sub_condition, "업종 소분류": upjong_code}
            projection4 = {"_id": False}

            if sub_condition == "안정성":
                for data in franchise.find(query4, projection4).sort([("자기자본비율(자본/자산)", -1), ("부채비율(부채/자본)", 1)]).limit(1):
                    temp.append(data)
            else:
                for data in franchise.find(query4, projection4).sort("매출액 순이익률(당기순이익/매출액)", -1).limit(1):
                    temp.append(data)
        
        result.append(temp)

    return jsonify(result)


@extra.route("/extra/real-estate", methods=["POST"])
def extra_real_estates():
    name = request.form.get("name")
    way = request.form.get("way")
    price = request.form.get("price")
    parking = request.form.get("parking")

    price_dict = {
        "two": "1억",
        "three": "2억",
        "four": "3억",
        "five": "4억"
    }

    way_dict = {
        "monthly": "월세",
        "lease": "전세",
        "dealing": "매매",
        "short_rental": "단기임대"
    }

    result = []
    temp = []

    # 상권코드명으로 상권코드 가져오기
    commercial_area = db.get_collection("commercial_area")
    
    query2 = {"상권_코드_명": name}
    projection2 = {"_id": False, "상권_코드": True}

    code = commercial_area.find_one(query2, projection2)["상권_코드"]

    # 부동산
    real_estate = db.get_collection("real_estate")

    if way != "total":
        way = way_dict[way]

        if parking == "total":
            query5 = {
                "상권_코드": code,
                "거래방식": way
            }
        else:
            query5 = {
                "상권_코드": code,
                "거래방식": way,
                "주차가능여부": parking
            }
    else:
        if parking == "total":
            query5 = {
                "상권_코드": code
            }
        else:
            query5 = {
                "상권_코드": code,
                "주차가능여부": parking
            }
    projection5 = {"_id": False}

    real_estates = list(real_estate.find(query5, projection5))
    
    if price == "total":
        result = real_estates
    else:
        for data in real_estates:
            if price == "one":
                if "억" not in data["가격"]:
                    result.append(data)
            elif price == "six":
                if "억" in data["가격"]:
                    if data["가격"].split("억")[0] not in ["1", "2", "3", "4"]:
                        result.append(data)
            else:
                if data["가격"].startswith(price_dict[price]):
                    result.append(data)
    
    return jsonify(result)
