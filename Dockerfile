FROM ubuntu:16.04

ENV MAVEN_VERSION 3.3.3
ENV NODE_VERSION 6.4.0

USER root

RUN apt-get update

#========================
# Miscellaneous packages
#========================
RUN apt-get update -qqy \
  && apt-get -qqy --no-install-recommends install \
    sudo \
    openjdk-8-jdk \
    tar \
    zip xz-utils \
    curl wget \
    git \
    build-essential \
    python \
    iputils-ping \
  && rm -rf /var/lib/apt/lists/* \
  && sed -i 's/securerandom\.source=file:\/dev\/random/securerandom\.source=file:\/dev\/urandom/' ./usr/lib/jvm/java-8-openjdk-amd64/jre/lib/security/java.security

#==========
# Maven
#==========
RUN curl -fsSL http://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz | tar xzf - -C /usr/share \
  && mv /usr/share/apache-maven-$MAVEN_VERSION /usr/share/maven \
  && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn
ENV MAVEN_HOME /usr/share/maven


#===============
# Node and NPM
#===============
RUN wget --no-verbose https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz -O /opt/nodejs.tar.xz
RUN tar -C /usr/local --strip-components 1 -xJf /opt/nodejs.tar.xz
RUN mkdir /.npm && chmod 777 /.npm

#=============================================
# Misc packages needed by the ATH
#=============================================
RUN apt-get update -qqy \
  && apt-get -qqy --no-install-recommends install \
    libxml2-utils \
    libssl-dev \
  && rm -rf /var/lib/apt/lists/*

#========================================
# Add normal user with passwordless sudo
#========================================
RUN sudo useradd bouser --shell /bin/bash --create-home \
  && sudo usermod -a -G sudo bouser \
  && echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers \
  && echo 'bouser:secret' | chpasswd

USER bouser
WORKDIR /home/bouser

#========================================
# Configure the local git user.
#========================================
RUN git config --global user.name "John Doe"
RUN git config --global user.email johndoe@example.com