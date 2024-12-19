
<div align="center">

  ![Nestjs][Nestjs.io]
  ![Mysql][Mysql.io]
  ![Docker][Docker.io]

  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  [![Unlicense License][license-shield]][license-url]

  <h3>Task</h3>
  Um to-do list mais elaborado
</div>

# 📖 Sobre 
Task é um gerenciador de tarefas que pode ser compartilhado entre varias pessoas

# 📋 Motivo
Esse projeto existe, para implementer features mais avançadas do Nest, e como um projeto teste para testa funcionalidades novas

# 💻 Como iniciar
Instruções de como executar o seu projeto
1. Certifique-se de ter o Docker instalado em sua máquina. Caso não tenha, siga as instruções no [site oficial do Docker](https://docs.docker.com/get-docker/).

2. Clone o repositório do projeto:
  ```sh
  git clone https://github.com/bgluis/tasks.git
  ```

3. Navegue até o diretório do projeto:
  ```sh
  cd tasks
  ```

4. Preencha o arquivo `.env` com as variáveis de ambiente necessárias. Utilize o arquivo `.env.example` como referência:
  ```sh
  cp .env.example .env
  # Edite o arquivo .env com suas configurações
  ```

5. Construa e inicie os containers Docker:
  ```sh
  docker-compose up --build
  ```

6. Acesse a aplicação no seu navegador através do endereço configurado no .env:
  ```
  http://localhost:3000
  ```

# 🤝 Contribuidores
 <a href = "https://github.com/bgluis/tasks/graphs/contributors">
   <img src = "https://contrib.rocks/image?repo=bgluis/tasks"/>
 </a>

[repossitory-path]: bgluis/tasks/
[contributors-shield]: https://img.shields.io/github/contributors/bgluis/tasks.svg?style=for-the-badge
[contributors-url]: https://github.com/bgluis/tasks/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bgluis/tasks.svg?style=for-the-badge
[forks-url]: https://github.com/bgluis/tasks/network/members
[stars-shield]: https://img.shields.io/github/stars/bgluis/tasks.svg?style=for-the-badge
[stars-url]: https://github.com/bgluis/tasks/stargazers
[issues-shield]: https://img.shields.io/github/issues/bgluis/tasks.svg?style=for-the-badge
[issues-url]: https://github.com/bgluis/tasks/issues
[license-shield]: https://img.shields.io/github/license/bgluis/tasks.svg?style=for-the-badge
[license-url]: https://github.com/bgluis/tasks/blob/master/LICENSE.txt

[Nestjs.io]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[Mysql.io]: https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&color=00758f&logoColor=white
[Docker.io]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
