FROM cloudbees/java-build-tools

USER root
RUN apt-get update
RUN apt-get install -y libxml2-utils libssl-dev

# ENTRYPOINT bash