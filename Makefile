PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: login dashboard management public

public: public/dashboard/index.js public/login/index.js assets

public/dashboard/index.js: dashboard/*
	browserify dashboard/index.js > public/dashboard/index.js

dashboard: dashboard/*
	watchify dashboard/index.js -dv -o public/dashboard/index.js

public/login/index.js: login/*
	browserify login/index.js > public/login/index.js

login: src/login/*
	watchify src/login/index.js -dv -o public/login/index.js

management:
	cd management && yarn build
	cp -r management/build public/management

assets:
	cp node_modules/bootstrap/dist/css/bootstrap.css public/assets/css/
	cp node_modules/echarts/dist/echarts.simple.min.js public/assets/js/
