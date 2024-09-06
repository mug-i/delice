document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".nav-toggler");
  const menuLinks = document.querySelector(".navMobile");

  menuButton.addEventListener("click", function () {
    menuLinks.style.display =
      menuLinks.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
      menuLinks.style.display = "flex";
    } else {
      menuLinks.style.display = "none";
    }
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   const navToggler = document.querySelector(".nav-toggler");
//   const navMenu = document.querySelector(".navLien");

//   navToggler.addEventListener("click", function () {
//     navMenu.classList.toggle("active"); // Ajoute ou supprime la classe 'active' au menu de navigation
//     navToggler.classList.toggle("active"); // Ajoute ou supprime la classe 'active' au bouton de navigation
//   });

//   // Ajouter une écoute pour ajuster le menu lors du redimensionnement de l'écran
//   window.addEventListener("resize", function () {
//     if (window.innerWidth > 768) {
//       // Changer 768 en la largeur de votre choix pour le seuil de bascule mobile/tablette
//       navMenu.classList.remove("active");
//       navToggler.classList.remove("active");
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  // Obtenir l'URL actuelle
  const currentUrl = window.location.pathname;

  // Sélectionner tous les liens de navigation
  const links = document.querySelectorAll(".lien a");

  // Parcourir chaque lien et ajouter la classe 'active' si le lien correspond à l'URL actuelle
  links.forEach((link) => {
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active");
    }
  });
});
