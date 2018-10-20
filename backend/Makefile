.PHONY: all serve test dockerimg

all: serve

serve:
	npm run serve

format:
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "src/**/*.js"
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "test/**/*.js"

test:
	npm run test

IMAGE_NAME=growlerbackend
VERSION=v0.1.0

dockerimg:
	docker build -f ./Dockerfile -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest .
