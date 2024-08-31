from flask import Flask, render_template, Blueprint, request, jsonify   
from pymongo import MongoClient

factor = Blueprint('factor',__name__)

connection = MongoClient("mongodb+srv://user1:uZGuuMyRngM3izgG@cluster0.cu0c3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", connect=False)
db = connection.get_database('elice')
job_col=db.get_collection('corr_sales_job_pop')
fac_col=db.get_collection('corr_sales_facility')
foot_col=db.get_collection('corr_sales_foot_traffic')
income_col = db.get_collection('corr_sales_income')


def make_label_data(list_data,cat,corr,col):
    projection={'_id':False}
    col_list=list(col.find({},projection).sort([('correlation',-1),('category',-1)]))[:6]
    for i in col_list:
        cat.append(i.get('category'))
    for i in col_list:
        corr.append(round(i.get('correlation'),2))
    list_data.append(cat)
    list_data.append(corr)


# 직업 상관관계 데이터
job_data=[]
job_lab=[]
job_cor=[]
make_label_data(job_data,job_lab,job_cor,job_col)
new_dict={'남성연령대_10_직장_인구_수':'10대 직장인'}

# 집객 시설 상관관계 데이터
#nan값이 들어있어 수동으로 함
facility=list(fac_col.find({},{'_id':False}).sort([('correlation',-1),('category',-1)]))[:6]
fac_label=[]
fac_cor=[]

for i in facility:
    fac_label.append(i.get('category'))
for i in facility:
    fac_cor.append(round(i.get('correlation'),2))


fac_data=[fac_label,fac_cor]

#유동인구 상관관계 데이터
foot_data=[]
foot_lab=[]
foot_cor=[]
make_label_data(foot_data,foot_lab,foot_cor,foot_col)
#지출 상관관계 데이터
income_data=[]
income_lab=[]
income_cor=[]
make_label_data(income_data,income_lab,income_cor,income_col)

@factor.route("/factor", methods=["GET"])
def factor_page():

    return render_template("factor_analysis.html", 
                            job_data=job_data,
                            fac_data=fac_data,
                            foot_data=foot_data, 
                            income_data=income_data)

@factor.route("/factor/map", methods=["GET"])
def map_page():
    return render_template("seoul_map.html")
