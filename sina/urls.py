#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'wangdustin'

from django.conf.urls import patterns, include, url
import views

urlpatterns = patterns('',

    url(r'^$', views.wrapper(views.hello)),
    url(r'^signin/$', views.signin),
    url(r'^callback/$', views.callback),
    url(r'^getNewerStatuses/$', views.wrapper(views.update)),
    url(r'^getOlderStatuses/$', views.wrapper(views.update)),
)