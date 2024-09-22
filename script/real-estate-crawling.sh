#!/bin/bash
SOUCRE_DIR=/home/ubuntu/elice-team5-projects/python
LOG_DIR=/home/ubuntu/elice-team5-projects/log

echo "부동산 크롤링 배치 시작" > $LOG_DIR/real-estate-crawling.log
date >> $LOG_DIR/real-estate-crawling.log
python3 $SOUCRE_DIR/real-estate-crawling.py >> $LOG_DIR/real-estate-crawling.log 2>&1
echo "부동산 크롤링 배치 종료" >> $LOG_DIR/real-estate-crawling.log
date >> $LOG_DIR/real-estate-crawling.log
