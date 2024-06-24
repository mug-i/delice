const formAuth = document.getElementById("form-auth");
const inputIdentifiant = document.getElementById("input-identifiant");
const inputMotPasse = document.getElementById("input-mot-passe");
const inputNom = document.getElementById("input-nom");
const inputPrenom = document.getElementById("input-prenom");
const formErreur = document.getElementById("form-erreur");

async function inscription(event) {
  event.preventDefault();

  let data = {
    courriel: inputIdentifiant.value,
    motDePasse: inputMotPasse.value,
    nom: inputNom.value,
    prenom: inputPrenom.value,
  };

  let response = await fetch("/api/inscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    alert("L'inscription a été effectué avec succès!");
    location.replace("/connexion");
  } else if (response.status === 409) {
    formErreur.innerText = "L'utilisateur est déjà existant";
  }
}

formAuth.addEventListener("submit", inscription);
