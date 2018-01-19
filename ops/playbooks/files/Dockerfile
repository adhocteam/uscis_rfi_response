FROM jenkins/jenkins:lts-alpine
USER root
RUN apk add --no-cache py-pip
RUN pip install awscli
USER jenkins
