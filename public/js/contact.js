document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Récupérer les valeurs des champs du formulaire
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    try {
      // Envoyer les données au serveur via une requête POST
      const response = await fetch("/envoyer-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        location.reload();
        // Réinitialiser le formulaire après l'envoi
        alert("Message envoyé avec succès !");
      } else {
        console.log(1);
        alert("Une erreur s'est produite lors de l'envoi du messagessxsxs.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête :", error);
      alert("Une erreur s'est produite lors de l'envoi du message.");
    }
  });
});
