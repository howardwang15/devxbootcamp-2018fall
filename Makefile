.PHONY: devup devdown produp proddown

devup:
	docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml up -d

devdown:
	docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml down

produp:
	docker-compose -f docker-compose.yaml -f docker-compose-prod.yaml up -d

proddown:
	docker-compose -f docker-compose.yaml -f docker-compose-prod.yaml down
