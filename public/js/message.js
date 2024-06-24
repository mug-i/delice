async function supprimerMessageTraite(event) {
  // Préparation des données pour les envoyer au serveur
  let data = {
    id_message: parseInt(event.currentTarget.dataset.id),
  };

  // Envoyer la requête au serveur
  let response = await fetch("/api/messages", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // Analyse de la réponse du serveur
  if (response.ok) {
    location.reload();
  }
}

//pour effacer un produit dans le panier
let boutonEffacerMessageTraite = document.querySelectorAll(".boutonTraite");
for (let bouton of boutonEffacerMessageTraite) {
  bouton.addEventListener("click", supprimerMessageTraite);
}
