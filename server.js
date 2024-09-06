// Aller chercher les configurations de l'application
import "dotenv/config";

// Importer les fichiers et librairies
import https from "node:https";
import { readFile } from "node:fs/promises";

import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import memorystore from "memorystore";
import passport from "passport";
import cspOption from "./csp-options.js";
import { getProduit } from "./model/produit.js";
import {
  getPanier,
  addToPanier,
  removeFromPanier,
  emptyPanier,
} from "./model/panier.js";
import {
  getCommande,
  soumettreCommande,
  modifyEtatCommande,
  getEtatCommande,
} from "./model/commande.js";
import "./authentification.js";
import {
  validateId,
  validatePanier,
  IsIdentifiantValid,
  IsMOtdepasseValid,
  IsnomValid,
  IsprenomValid,
} from "./validation.js";
import { addUtilisateur } from "./model/utilisateur.js";
import middlewareSse from "./middleware-sse.js";
import {
  getMessage,
  insererMessage,
  supprimerMessageTraite,
} from "./model/contact.js";

// Création du serveur
const app = express();

//config BD de session
const MemoryStore = memorystore(session);

// Configuration de l'engin de rendu
app.engine(
  "handlebars",
  engine({
    helpers: {
      equals: (valeur1, valeur2) => valeur1 === valeur2,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(
  session({
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(middlewareSse());

// Routes
// Route de la page du menu
app.get("/", async (request, response) => {
  response.render("menu", {
    title: "produits",
    produit: await getProduit(),
    user: request.user,
    acheteur: request.user && request.user.id_type_utilisateur === 1,
    admin: request.user && request.user.id_type_utilisateur === 2,
  });
});

app.get("/connexion", (request, response) => {
  response.render("connexion", {
    titre: "Connexion",
    styles: ["/css/normalize.css", "/css/style.css"],
    scripts: ["/js/connexion.js"],
    bouton: "Connecter",
    user: request.user,
    acheteur: request.user && request.user.id_type_utilisateur === 1,
    admin: request.user && request.user.id_type_utilisateur === 2,
  });
});

app.get("/inscription", (request, response) => {
  response.render("authentification", {
    titre: "Inscription",
    styles: ["/css/normalize.css", "/css/style.css"],
    scripts: ["/js/inscription.js"],
    bouton: "S'inscrire",
    user: request.user,
    acheteur: request.user && request.user.id_type_utilisateur === 1,
    admin: request.user && request.user.id_type_utilisateur === 2,
  });
});

// Route de la page du panier
app.get("/panier", async (request, response) => {
  let panier = await getPanier();
  response.render("panier", {
    title: "Panier",
    produit: panier,
    estVide: panier.length <= 0,
    user: request.user,
    acheteur: request.user && request.user.id_type_utilisateur === 1,
    admin: request.user && request.user.id_type_utilisateur === 2,
  });
});
//route la page contact
app.get("/contact", async (request, response) => {
  response.render("contact", {
    title: "contact",
    styles: ["/css/normalize.css", "/css/contact.css"],
    scripts: ["/js/contact.js"],
    // produit: await getProduit(),
    user: request.user,
    acheteur: request.user && request.user.id_type_utilisateur === 1,
    admin: request.user && request.user.id_type_utilisateur === 2,
  });
});
//route pour la page des messages admin
app.get("/messages", async (request, response) => {
  response.render("messages", {
    title: "message",
    styles: ["/css/normalize.css", "/css/message.css"],
    messages: await getMessage(),
    scripts: ["/js/message.js"],
    user: request.user,
    acheteur: request.user && request.user.id_type_utilisateur === 1,
    admin: request.user && request.user.id_type_utilisateur === 2,
  });
});
// Route pour recevoir les données du formulaire
app.post("/envoyer-message", (req, res) => {
  const { name, email, message } = req.body; // Récupérer les données du corps de la requête
  res.sendStatus(200);
  // Faire quelque chose avec les données, par exemple les enregistrer dans une base de données
  insererMessage(name, email, message);
});
// Route pour ajouter un élément au panier
app.post("/panier", async (request, response) => {
  if (validateId(request.body.idProduit)) {
    addToPanier(request.body.idProduit, 1);
    response.sendStatus(201);
  } else {
    response.sendStatus(400);
  }
});
// Route pour supprimer un élément du panier
app.patch("/panier", async (request, response) => {
  if (validateId(request.body.idProduit)) {
    removeFromPanier(request.body.idProduit);
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});

// Route pour vider le panier
app.delete("/panier", async (request, response) => {
  emptyPanier();
  response.sendStatus(200);
});

//route pour supprimer un message traite
app.delete("/api/messages", async (request, response) => {
  if (validateId(request.body.id_message)) {
    await supprimerMessageTraite(request.body.id_message);
    response.status(200).end();
  } else {
    response.status(400).end();
  }
});

// Route de la page des commandes
app.get("/commande", async (request, response) => {
  response.render("commande", {
    title: "Commandes",
    commande: await getCommande(),
    etatCommande: await getEtatCommande(),
    user: request.user,
    acheteur: request.user && request.user.id_type_utilisateur === 1,
    admin: request.user && request.user.id_type_utilisateur === 2,
  });
});

// Route pour soumettre le panier
app.post("/commande", async (request, response) => {
  if (await validatePanier()) {
    soumettreCommande();

    response.sendStatus(201);
    let commande = await getCommande();
    response.pushJson(
      {
        commande: await getCommande(),
        id: commande.length,
      },
      "nouvelle-commande-ajouter"
    );
  } else {
    response.sendStatus(400);
  }
});

// Route pour modifier l'état d'une commande
app.patch("/commande", async (request, response) => {
  if (
    validateId(request.body.idCommande) &&
    validateId(request.body.idEtatCommande)
  ) {
    modifyEtatCommande(request.body.idCommande, request.body.idEtatCommande);
    response.pushJson(
      {
        id: request.body.idCommande,
        idEtat: request.body.idEtatCommande,
      },
      "etat-commande-changer"
    );
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});

app.post("/api/inscription", async (request, response, next) => {
  // On vérifie le le courriel et le mot de passe
  // envoyé sont valides
  if (
    IsIdentifiantValid(request.body.courriel) &&
    IsMOtdepasseValid(request.body.motDePasse) &&
    IsnomValid(request.body.nom) &&
    IsprenomValid(request.body.prenom)
  ) {
    try {
      // Si la validation passe, on crée l'utilisateur
      await addUtilisateur(
        request.body.courriel,
        request.body.motDePasse,
        request.body.nom,
        request.body.prenom
      );
      response.sendStatus(201);
    } catch (erreur) {
      // S'il y a une erreur de SQL, on regarde
      // si c'est parce qu'il y a conflit
      // d'identifiant
      if (erreur.code === "SQLITE_CONSTRAINT") {
        response.sendStatus(409).end();
      } else {
        next(erreur);
      }
    }
  } else {
    response.sendStatus(400).end();
  }
});

app.post("/api/connexion", (request, response, next) => {
  // On vérifie le le courriel et le mot de passe
  // envoyé sont valides
  if (
    IsIdentifiantValid(request.body.courriel) &&
    IsMOtdepasseValid(request.body.motDePasse)
  ) {
    // On lance l'authentification avec passport.js
    passport.authenticate("local", (erreur, user, info) => {
      if (erreur) {
        // S'il y a une erreur, on la passe
        // au serveur
        next(erreur);
      } else if (!user) {
        // Si la connexion échoue, on envoit
        // l'information au client avec un code
        // 401 (Unauthorized)
        response.status(401).json(info);
      } else {
        // Si tout fonctionne, on ajoute
        // l'utilisateur dans la session et
        // on retourne un code 200 (OK)
        request.logIn(user, (erreur) => {
          if (erreur) {
            next(erreur);
          }

          response.sendStatus(200).end();
        });
      }
    })(request, response, next);
  } else {
    response.sendStatus(400).end;
  }
});

app.post("/api/deconnexion", (request, response) => {
  // Déconnecter l'utilisateur
  request.logOut((erreur) => {
    if (erreur) {
      next(erreur);
    }
  });

  // Rediriger l'utilisateur vers une autre page
  response.redirect("/");
});

// Renvoyer une erreur 404 pour les routes non définies
// app.use(function (request, response) {
//     // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
//     response.status(404).send(request.originalUrl + ' not found.');
// });

//route pour ouvrir le canal sse
app.get("/api/stream", (request, response) => {
  response.initStream();
});

// Démarrage du serveur
if (process.env.NODE_ENV === "development") {
  let credentials = {
    key: await readFile("./security/localhost.key"),
    cert: await readFile("./security/localhost.cert"),
  };
  https.createServer(credentials, app).listen(process.env.PORT);
  console.info(`Serveurs démarré:`);
  console.info(`https://localhost:${process.env.PORT}`);
} else {
  app.listen(process.env.PORT);
  console.info(`Serveurs démarré:`);
  console.info(`http://localhost:${process.env.PORT}`);
}
