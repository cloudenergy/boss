
export PATH := node_modules/.bin/:$(PATH)

dashboard/index.js: src/dashboard/index.js
	browserify src/dashboard/index.js > dashboard/index.js

login/index.js: src/login/index.js
	browserify src/login/index.js > login/index.js

assets:
	cp node_modules/bootstrap/dist/css/bootstrap.css assets/css/
	cp node_modules/echarts/dist/echarts.simple.min.js assets/js/
