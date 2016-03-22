#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'wangdustin'

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
import json
import os
from weibo import APIClient

APP_KEY = '2034163277'
APP_SECRET = 'e60c8db42fa2003d942f34162cc4879e'
CALLBACK_URL = 'http://xifanyrpy.jios.org:8000/callback/'

def hello(request, client):
    return render(request, 'index.html')

def signin(request):
    client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
    url = client.get_authorize_url()
    return HttpResponse(json.dumps(url, ensure_ascii=False))

def callback(request):
    code = request.GET.get('code')
    client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
    r = client.request_access_token(code)
    request.session['token'] = r.access_token
    request.session['expire'] = r.expires_in
    return HttpResponseRedirect('/')

def update(request, client):
    since_id = request.GET.get('since_id', 0)
    max_id = request.GET.get('max_id', 0)
    result = client.statuses.friends_timeline.get(since_id=since_id, max_id=max_id)
    result = parse_json(result)
    return HttpResponse(json.dumps(result))

def upload(request, client):
    status = request.POST.get()
    # pic = request.POST.get()
    result = client.statuses.update.post(status=status)
    return HttpResponse(json.dumps(result))

def wrapper(view):
    def new_view(request, *args, **kwargs):
        if 'token' in request.session and 'expire' in request.session:
            client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)
            client.set_access_token(request.session['token'], request.session['expire'])
            if client.is_expires():
                return render(request, 'loginForm.html')
            return view(request, client, *args, **kwargs)
        return render(request, 'loginForm.html')
    return new_view

def parse_json(weibo_json):
    result = {}
    for k in weibo_json.keys():
        if k in ['since_id', 'max_id']:
            result[k] = weibo_json[k]
    result['statuses'] = []
    for status in weibo_json['statuses']:
        s = {}
        for k in status.keys():
            if k in ['reposts_count', 'text', 'id', 'source', 'pic_urls', 'created_at', 'comments_count']:
                s[k] = status[k]
            elif k=='user':
                s[k] = {'id': status[k]['id'], 'profile_image_url': status[k]['profile_image_url'], 'screen_name': \
                    status[k]['screen_name']}
        retweeted = status.get('retweeted_status', None)
        if retweeted:
            s['retweeted_status'] = {}
            for k in retweeted.keys():
                if k in ['reposts_count', 'text', 'id', 'source', 'pic_urls', 'created_at', 'comments_count']:
                    s['retweeted_status'][k] = retweeted[k]
                elif k=='user':
                    s['retweeted_status'][k] = {'id': retweeted[k]['id'], 'profile_image_url': \
                        retweeted[k]['profile_image_url'], 'screen_name': retweeted[k]['screen_name']}
        result['statuses'].append(s)
    return result

