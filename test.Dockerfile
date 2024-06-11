## nginx基础镜像,版本号为1.17.2
From nginx:1.17.2
## 复制NGINX配置⽂件到指定⽬录
COPY default.conf /etc/nginx/conf.d/
## 复制项⽬运⾏⽂件到指定⽬录
COPY build /usr/share/nginx/html/