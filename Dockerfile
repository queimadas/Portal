FROM nginx:latest

COPY environment/config/nginx.conf /etc/nginx/nginx.conf

COPY /webapp /usr/share/nginx/html/

EXPOSE 80 443

ENTRYPOINT ["nginx"]

# Extras parameters for entrypoint
CMD ["-g", "daemon off;"]