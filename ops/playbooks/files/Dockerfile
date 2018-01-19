FROM jenkins/jenkins:lts-alpine
USER root

RUN apk add --no-cache py-pip && \
    pip install awscli
RUN echo http://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    apk update && \
    apk add docker
RUN wget -O /tmp/terraform.zip https://releases.hashicorp.com/terraform/0.11.2/terraform_0.11.2_linux_amd64.zip && \
    unzip -o -d /tmp /tmp/terraform.zip && \
    mv /tmp/terraform /usr/bin/terraform

USER jenkins
