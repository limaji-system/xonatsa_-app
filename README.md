# XonaTSA — flux d'authentification

Fichiers volontairement **tous à la racine** du dépôt GitHub :

- `index.html` — point d'entrée
- `main.ts` — navigation et rendu des 6 pages
- `auth.ts` — logique de compte/session/récupération
- `styles.css` — interface
- `package.json` — dépendances/scripts
- `tsconfig.json` — configuration TypeScript

## Pages

1. Page de démarrage / connexion
2. Page de connexion
3. Page de création de compte
4. Page de mot de passe oublié
5. Confirmation du code de récupération
6. Choix de profil

## Important

Le code fourni est un **socle fonctionnel local de démonstration** : les comptes sont stockés dans `localStorage`. Pour une application réelle, les mots de passe ne doivent pas être stockés ainsi. Il faudra brancher l'authentification à un backend sécurisé (par exemple Firebase Authentication) et un service d'e-mail pour envoyer réellement les codes de récupération.

Aucune photo ou image externe n'est nécessaire : l'interface utilise uniquement du HTML/CSS et reste donc entièrement à plat dans le dépôt.

## Installation

```bash
npm install
npm run dev
```

Puis pour vérifier la compilation :

```bash
npm run build
```
