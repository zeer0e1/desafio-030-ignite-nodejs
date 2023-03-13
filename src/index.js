const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function findRepository(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id == id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = repositories[repositoryIndex];

  // Impede que a quantidade de likes seja atualizada manualmente
  const updatedRepository = {
    ...repository,
    title,
    url,
    techs,
  };

  if (likes !== undefined) {
    updatedRepository.likes = repository.likes;
  }

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoriIndex = repositories.findIndex((repo) => repo.id == id);

  if (repositoriIndex < 0) {
    return response.status(404).send();
  }

  repositories.splice(repositoriIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", findRepository, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
