PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash
API_URI := https://api.51dianxiaoge.com

.PHONY: login dashboard management public clean public/management

public: public/dashboard/index.js public/login/index.js assets public/management

clean:
	rm public/dashboard/index.js
	rm public/login/index.js
	rm -r public/management/

public/dashboard/index.js: dashboard/index.js
	env API_URI=${API_URI} browserify dashboard/index.js -t envify > public/dashboard/index.js

dashboard: dashboard/*
	watchify dashboard/index.js -t envify -dv -o public/dashboard/index.js

public/login/index.js: login/index.js
	env API_URI=${API_URI} browserify login/index.js -t envify > public/login/index.js

login: login/*
	watchify login/index.js -t envify -dv -o public/login/index.js

public/management:
	cd management && yarn && yarn build
	cp -r management/build public/management

management:
	cd management && yarn start

assets:
	cp node_modules/bootstrap/dist/css/bootstrap.css public/assets/css/
	cp node_modules/echarts/dist/echarts.simple.min.js public/assets/js/
