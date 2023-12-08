
```sh
npx projectedby static gen --theme=cms --destination=docs
```

```sh
docker run -itd --rm -v .\docs:/usr/share/nginx/html -p 8080:80 --name projectedby nginx
```
