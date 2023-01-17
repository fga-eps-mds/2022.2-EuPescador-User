# 2022.2-EuPescador-User
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2022.2-EuPescador-User&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2022.2-EuPescador-User) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2022.2-EuPescador-User&metric=coverage)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2022.2-EuPescador-User) 

## 1. Ambiente de desenvolvimento
Para fazer uso do ambiente de desenvolvimento é necessário possuir dois pacotes instalados.
* docker
* docker-compose

## 1.1 Mas o que é Docker?
Docker é uma plataforma aberta, criada com o objetivo de facilitar o desenvolvimento, a implantação e a execução de aplicações em ambientes isolados. Para uma base maior do seu propósito e funcionamento é possível acessar o seguinte link:

https://www.redhat.com/pt-br/topics/containers/what-is-docker

## 1.2 Uso do Docker e Docker-compose
Para efetuar o build das imagens só se faz necessário rodar o seguinte comando na raiz do projeto:

```bash
docker compose build
```

Após o build, podemos fazer o comando na raiz do projeto para iniciar a imagem criada:
```bash
docker compose up
```
