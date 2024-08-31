from flask import Blueprint, render_template, jsonify, request
from pymongo import MongoClient

main = Blueprint('main',__name__)
#mongoDb 연걸
connection = MongoClient("mongodb+srv://user1:uZGuuMyRngM3izgG@cluster0.cu0c3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", connect=False)
db = connection.get_database('elice')

#col불러오기
gender_rate = db.get_collection('sales_rate_gender')
age_rate =db.get_collection('sales_rate_age')
sales_info = db.get_collection('sales_info')
day_rate = db.get_collection('sales_rate_day')
market_col = db.get_collection('commercial_area')
average_sale_ratio = db.get_collection('sales_info_sales')
business_ratio = db.get_collection('sales_info_business_ratio_2021')
service_col = db.get_collection('sales_info_detail')
#트렌드데이터 생성함수
def make_label_data(list_data,col):
    lab=[]
    ratio=[]
    projection={'_id':False}
    col_list=list(col.find({},projection).limit(10))
    for i in col_list:
        lab.append(i.get('서비스_업종_코드_명'))
    for i in col_list:
        ratio.append(round(i.get('점포수_비율'),2))
    etc = 100-sum(ratio)
    lab.append('기타')
    ratio.append(etc)
    list_data.append(lab)
    list_data.append(ratio)

def make_data(list_data,column,column2,col):
    lab=[]
    ratio=[]
    projection={'_id':False}
    col_list=list(col.find({},projection))
    for i in col_list:
        lab.append(i.get(column))
    for i in col_list:
        ratio.append(round(i.get(column2),2))

    list_data.append(lab)
    list_data.append(ratio)

@main.route("/",methods=['GET'])
def main_page():
  
    projection = {'_id':False}

    sales_top5 = list(sales_info.find({'기준_년_코드':2020},projection).sort('전년도비_매출_증감률',-1).limit(5))
    sales_low5 = list(sales_info.find({'기준_년_코드':2020},projection).sort('전년도비_매출_증감률',1).limit(5))

    market_lab = list(market_col.find({},projection).sort("상권_코드_명",1))
    
    
    trend_data=[]
    make_label_data(trend_data,business_ratio)
  

    store_data=[]
    make_data(store_data,'기준_년_코드','점포수',average_sale_ratio)
    store_data[0].pop(0)
    store_data[1].pop(0)
    revenue_data=[]
    make_data(revenue_data,'기준_년_코드','연매출평균',average_sale_ratio)
    revenue_data[0].pop(0)
    revenue_data[1].pop(0)

    return render_template('index.html',
                            sales_top= sales_top5,
                            sales_low= sales_low5, 
                            market=market_lab,
                            trend=trend_data,
                            store=store_data,
                            revenue=revenue_data)



@main.route("/market-name",methods=['POST'])
def market_name():
    service_code = request.form.get("code")
    print(service_code)
    
    return service_code


@main.route("/market-name/list", methods=['POST'])
def factor_bring_data():
    value = request.form.get("code")
    query = {"상권_코드": int(value)}       
    
    projection = {'_id':False}
    
    gender_data= list(gender_rate.find(query,projection).sort('서비스_업종_코드_명',1))
    age_data = list(age_rate.find(query,projection))
    
    day_data = list(day_rate.find(query,projection))
    
    
    data = [gender_data,age_data,day_data]


    return jsonify(data)

@main.route("/market-name/list/service", methods=['POST'])
def service_list():
    market_code = request.form.get("market_code")
    service_code = request.form.get("service_code")

    projection={'_id':False}
    service_data = list(service_col.find({'상권_코드': market_code, '서비스_업종_코드': service_code}, projection).sort("기준_년_코드", 1))
    
    return jsonify(service_data)
