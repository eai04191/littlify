FROM node:12-alpine AS builder
WORKDIR /littlify
ENV SERVER_URI=/api

# cache
RUN apk add --no-cache util-linux
ADD ./package.json /littlify/package.json
ADD ./yarn.lock /littlify/yarn.lock
ADD ./packages/client/package.json /littlify/packages/client/package.json
ADD ./packages/server/package.json /littlify/packages/server/package.json
RUN yarn

ADD ./ /littlify
RUN yarn client:build

FROM node:12-alpine
WORKDIR /littlify

COPY --from=builder /littlify/node_modules /littlify/node_modules
COPY --from=builder /littlify/package.json /littlify/package.json
COPY --from=builder /littlify/tsconfig.json /littlify/tsconfig.json
COPY --from=builder /littlify/packages/client/dist /littlify/packages/client/dist
COPY --from=builder /littlify/packages/server /littlify/packages/server
RUN \
    set -xe ; \
    wget https://github.com/just-containers/s6-overlay/releases/download/v1.21.4.0/s6-overlay-amd64.tar.gz -O - | gunzip -c | tar -xf - -C / ; \
    apk add --no-cache caddy util-linux ; \
    mkdir -p /etc/services.d/client /etc/services.d/server ; \
    echo '#!/usr/bin/execlineb -P' | tee -a /etc/services.d/server/run ; \
    echo 'cd /littlify/packages/server' | tee -a /etc/services.d/server/run ; \
    echo 'with-contenv' | tee -a /etc/services.d/server/run ; \
    echo 'npx ts-node src/server-local.ts' | tee -a /etc/services.d/server/run ; \
    echo '#!/usr/bin/execlineb -P' | tee -a /etc/services.d/client/run ; \
    echo 'with-contenv' | tee -a /etc/services.d/client/run ; \
    echo 'caddy --host 0.0.0.0 --port 80 --http-port 80 --root /littlify/packages/client/dist "rewrite /config /" "proxy /api http://127.0.0.1:3000/.netlify/functions/index { transparent without /api }"' | tee -a /etc/services.d/client/run

EXPOSE 80
ENTRYPOINT ["/init"]
