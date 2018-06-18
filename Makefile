export PATH := ./node_modules/.bin:$(PATH)
build: src/*
	browserify -p tsify src/app.tsx > public/app.js
