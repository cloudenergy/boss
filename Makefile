PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: login dashboard management public clean public/management test

public: public/index.js public/login/index.js assets public/management

test:
	cd management && yarn && yarn test-cov

clean:
	rm public/index.js
	rm public/login/index.js
	rm -r public/management/

public/index.js: dashboard/index.js
	env browserify dashboard/index.js -t envify > public/index.js

dashboard: dashboard/*
	watchify dashboard/index.js -t envify -dv -o public/index.js

public/login/index.js: login/index.js
	env browserify login/index.js -t envify > public/login/index.js

login: login/*
	watchify login/index.js -t envify -dv -o public/login/index.js

public/management: test
	cd management && yarn build
	cp -r management/build public/management

management:
	cd management && yarn start

assets:
	cp node_modules/bootstrap/dist/css/bootstrap.css public/assets/css/
	cp node_modules/bootstrap/dist/css/bootstrap.css.map public/assets/css/
	cp node_modules/jquery/dist/jquery.min.js public/assets/js/
	cp node_modules/echarts/dist/echarts.min.js public/assets/js/
