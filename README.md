# ShopNow JS — Application sous test Selenium

Mini application e-commerce en **JavaScript / Node.js / Express**, destinée au TP INF243.

## Fonctionnalités

- Créer un compte
- Se connecter / se déconnecter
- Consulter le catalogue
- Consulter un produit
- Ajouter au panier
- Modifier la quantité
- Supprimer un produit
- Vider le panier
- Calculer le total
- API REST

## Lancer

```bash
npm install
npm start
```

Puis ouvrir `http://localhost:3000`.

## Compte de démonstration

Email : `alice@shopnow.test`
Mot de passe : `Password123!`

Les comptes sont conservés uniquement en mémoire et sont réinitialisés au redémarrage.

## API

`GET /api/products`
`GET /api/products/:id`
`POST /api/register`
`POST /api/login`

## Tests Selenium

Le TP Selenium doit être réalisé dans un projet de tests séparé. L'application constitue uniquement l'application sous test.

Les `data-testid` disponibles sont listés dans `data-testids.md`.

## Informations personnelles

- Nom : Leroy
- Prénom : Martin

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Lancer l'application ShopNow :

```bash
npm start
```

Puis ouvrir `http://localhost:3000` dans votre navigateur.

## Lancer les tests

Ouvrir un terminal et, si l'application n'est pas déjà lancée, démarrer `npm start` dans un terminal puis, dans un autre :

```bash
npm test
# ou
npx mocha tests/e2e --reporter spec
```

## Navigateur utilisé

- Google Chrome (tests démarrés avec `selenium-webdriver` et `Builder().forBrowser(Browser.CHROME)`).

## Nombre de tests réalisés

- 15 fichiers de tests (`tests/e2e/*.spec.js`) — tests end-to-end couvrant authentification, listing, détail produit et panier.

## Qestions

- Quel est le rôle de Selenium WebDriver ?
Son rôle est de permettre d'interagir avec un navigateur à partir de code (beaucoup de langages différents).
On peut donc l'utiliser avec des bibliothèques de tests tout comme on pourrait l'utiliser pour faire un bot ou un crawler.

- Qu'est-ce qu'un sélecteur ?
Il permet de sélectionner un élément de la page HTML et en faire une entité dans le code afin de pouvoir la manipuler.
On peut trouver des éléments en parsant le code avec du css ou en utilisant les attributs html

- Pourquoi utiliser data-testid ?
Ils permettent plus facilement de sélectionner des éléments de notre code via les sélecteurs.

- Pourquoi utiliser des assertions ?
Cela permet de tester que les actions faites par selenium ont fonctionné, comme des éléments qui existent ou si telle chose a été crée ou supprimé, ou encore si on a changé de page.

- Pourquoi utiliser des attentes explicites ?
Elles permettent de ne pas faire des actions de selenium en avance et de causer des erreurs, et comme ce ne sont pas des attentes fixes, cela permet d'avoir une latence minime.

- Quelle différence entre un test fonctionnel et un test End-to-End ?
un test fonctionnel test une fonctionnalité, un test E2E test tout le parcours utilisateur d'un coup.

- Pourquoi réaliser des tests négatifs ?
Car les cas d'erreurs doivent être défini en avance et prévu par l'application donc on doit aussi s'assurer que l'application indique correctement qu'une erreur est arrivé et qu'elle soit normale / imdépotente.

- Quel est l'intérêt du Page Object Model ?
Pour économiser le code (DRY) et faciliter l'usage des fonctions classiques comme login utilisée un peu partout.

- Quels problèmes avez-vous rencontrés pendant l'automatisation ?
Il fallait rassembler les tests fonctionnels.

- Quels sont les avantages et les limites de Selenium ?
Avantages : automatisation largement facilitée.
Limites : Les waitings qui ralentissent les tests.