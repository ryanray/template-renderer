# Basic Template Renderer Based on Fastify

Minimal template rendering with simple environment variable based interpolation.

GitHub Repo: [https://github.com/ryanray/template-renderer](https://github.com/ryanray/template-renderer)

DockerHub Repo [https://hub.docker.com/r/ryanray/template-renderer](https://hub.docker.com/r/ryanray/template-renderer)

Fastify: [https://www.fastify.io/](https://www.fastify.io/)

## Example
```html
// ./my-templates/hello.hbs
<h1>Hello, from {{TMPL_SERVER_NAME}}!</h1>
```

```bash
version: "3.8"
services:
  my-basic-renderer:
    container_name: my-basic-renderer
    image: ryanray/template-renderer:latest
    ports:
      - "8080:3000"
    environment:
      - TMPL_SERVER_NAME="my-basic-renderer"
    volumes:
    # mount your own templates directory
    - ./my-templates:/usr/src/app/templates
```

```bash
docker-compose up
curl http://localhost:8080/hello
<h1>Hello, from my-basic-renderer!</h1>
```

## Configuration

### Custom Templates
When starting with Docker, docker-compose, or Kubernetes you just need to mount your own
template directory in the container at `/usr/src/app/templates`

```bash
docker run -it -v ./my-template-dir:/usr/src/app/templates -p 3000:3000 ryanray/template-renderer:latest
```

### Template Context
Template context is the data that gets passed to the template. The only way to modify that context at the moment
is by setting environment variables for the container. Any variable that starts with `TMPL_` will be
added to the context object.

### Template Resolution
BTR will take the path of the request and try to resolve the template first by looking for a directory by that name
with an index.hbs and if there isn't a directory by that name it will look for the path with hbs on the end.

Examples:
http://localhost:3000/dashboard -> /templates/dashboard/index.hbs

http://localhost:3000/dashboard/statistics -> /templates/dashboard/statistics/index.hbs

http://localhost:3000/about -> /templates/about.hbs 

http://localhost:3000/ -> /templates/index.hbs 

## Limitations / Nice to haves
There are A LOT of limitations. Keep in mind I threw this together pretty quickly for testing purposes.
* only supports handlebars at the moment(should be easy to add more support)
* environment variables regex is hardcoded - has to start with `TMPL_`
* Context is the same across all templates - would be nice to be able to configure context per template
* Would be nice to configure context via JSON or YAML instead of env variables
* I almost spent more time on the documentation than the code - and look how bad the docs are :grimacing:

## Why?
I needed a quick and easy way to drop some templates into a docker container and then
pass some data into them to have them rendered - mostly to demo other Kubernetes functionality.
So I published the image to DockerHub and here we are.
