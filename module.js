export const toto = "toto"; // export nomme

class Personne {
  constructor(nom, prenom) {
    this.nom = nom;
    this.prenom = prenom;
  }

  getNom() {
    return this.nom;
  }

  getPrenom() {
    return this.prenom;
  }
}

export default Personne; // export par défaut
