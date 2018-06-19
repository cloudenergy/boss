
.PHONY: assets dashboard

dashboard:
	node_modules/.bin/browserify src/dashboard/index.js > dashboard/index.js
assets:
	cp node_modules/bootstrap/dist/css/bootstrap.css assets/css/
	cp node_modules/echarts/dist/echarts.simple.min.js assets/js/
