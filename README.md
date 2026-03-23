# React Forge

Cette application React est maintenant configuree pour utiliser une API backend (Symfony) au lieu de `json-server`.

## Configuration API Symfony

1. Cree un fichier `.env` a la racine du projet.
2. Ajoute l'URL de ton API Symfony:

```
REACT_APP_API_URL=http://localhost:8000/api
```

Tu peux adapter cette URL selon ton backend (exemple: `http://localhost:8080/api`).

## Lancer le front

Dans le dossier du projet:

```
npm install
npm start
```

Application visible sur [http://localhost:3000](http://localhost:3000).

## Endpoints attendus

Le front utilise ces endpoints:

- `GET /characters`
- `GET /characters/:id`
- `GET /groups`
- `GET /groups/:id`

Le code accepte les reponses:

- Tableau JSON direct (`[...]`)
- API Platform (`hydra:member`)
- Objet avec `data`
