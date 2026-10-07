<h1 style="display: flex;justify-content: center">
    <img src="./public/img/logo-eplouribousse.png" style="max-width: 48rem;" alt="Entire logo of Eplouribousse" />
</h1>

**Eplouribousse [eˈpluːrɪbʊs] est une application web conçue pour faciliter le dédoublonnement de revues entre un ensemble de bibliothèques**

___

# Setup
> **Important** ⚠️ <br/>
> eplouribousse FRONTEND (eplfront) fonctionne en corrélation avec eplouribousse BACKEND (eplback), veuillez vous référer à [sa documentation](https://git.unistra.fr/di/eplouribousse/eplback/) pour le mettre en place
>
>Sans eplback, eplfront est une coquille vide, aucune donnée ne pourra être chargée.
 
**Prérequis**
- git
- node
- pnpm
- eplback fonctionnel
___
1. Cloner le projet
```shell
git clone git@git.unistra.fr:di/eplouribousse/eplfront.git
```

2. Installer les dépendances
```shell
pnpm install
```

3. Lancer le serveur local
```shell
pnpm dev
```

eplfront est bien démarré 🎉

Si vous avez suivi le setup de eplback, vous devriez pouvoir accéder à l'application via le lien `http://sxb.epl.localhost:5173`

___

# DEV

- Mise à jour des dépendances : voir [docs/dependency-updates.md](docs/dependency-updates.md)
