
.PHONY: assets

assets:
	cp node_modules/bootstrap/dist/css/bootstrap.css assets/css/
	cp node_modules/echarts/dist/echarts.simple.min.js assets/js/
