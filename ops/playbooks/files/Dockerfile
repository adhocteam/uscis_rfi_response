FROM jenkins/jenkins:lts-alpine
USER root

RUN apk add --no-cache py-pip
RUN pip install awscli
RUN echo http://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories
RUN apk update && apk add docker

USER jenkins
