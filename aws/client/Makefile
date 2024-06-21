ARTIFACTS_DIR ?= /tmp/bff/backend/dist/build

client:
		mkdir -p $(BFF_PACKAGES)/resources/dist
		deno run -A ${BFF_PACKAGES}/lib/build.ts $(BFF_PACKAGES)/resources/dist/client.js
