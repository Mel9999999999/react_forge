# Forge de Héros — Application React

Application front-end publique de consultation des personnages et groupes d'aventure, développée en React. Elle consomme l'API REST de l'application Symfony.

---

## Prérequis

- Node.js 18+
- npm 9+
- L'application Symfony doit être lancée (voir son README)

---

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd react_forge
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'URL de l'API

Créer un fichier `.env` à la racine du projet :

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api/v1
```

### 4. Lancer l'application

```bash
npm start
```

L'application est accessible sur **http://localhost:3000**

---

## Important

L'application Symfony doit être lancée avant de démarrer React :

```bash
# Dans un premier terminal — Symfony
symfony serve --no-tls

# Dans un second terminal — React
npm start
```

---

## Fonctionnalités

### Liste des personnages
- Affichage de tous les personnages avec avatar, nom, niveau, classe et race
- Recherche par nom
- Filtre par classe et par race
- Tri par nom ou par niveau

### Détail d'un personnage
- Informations complètes (classe, race, niveau)
- Barre de progression pour chaque statistique (FOR, DEX, CON, INT, SAG, CHA)
- Liste des compétences associées à la classe
- Groupes d'aventure du personnage

### Liste des groupes
- Affichage des groupes avec places disponibles
- Recherche par nom
- Nombre de membres / taille maximum

### Détail d'un groupe
- Informations du groupe (nom, description, taille)
- Liste des membres avec lien vers leur fiche

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Liste des personnages |
| `/character/:id` | Détail d'un personnage |
| `/groups` | Liste des groupes |
| `/group/:id` | Détail d'un groupe |

---

## Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| REACT_APP_API_URL | URL de base de l'API Symfony | http://127.0.0.1:8000/api/v1 |
