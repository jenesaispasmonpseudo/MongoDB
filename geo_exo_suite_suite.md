# Exercice GeoSpatiale

## Preparation

```bash
docker ps

docker cp ./restaurantsExo.json mongo:/data/restaurantsExo

docker cp ./neighborhoods.json mongo:/data/neighborhoods

docker exec -it mongo /bin/bash


mongoimport --db ExerciceGeo --collection restaurants  --file /data/restaurantsExo

mongoimport --db ExerciceGeo --collection neighborhoods  --file /data/neighborhoods

mongosh

```

## Creation des Index

```
db.neighborhoods.createIndex({"geometry":"2dsphere"})

db.restaurants.createIndex({"location":"2dsphere"})


```

### Exercice 1

Rechercher le nom du restaurant 

```
db.restaurants.find({"name":"Riviera Caterer"})

```
Renvoie 

[
  {
    _id: ObjectId('55cba2476c522cafdb053adf'),
    location: { coordinates: [ -73.98241999999999, 40.579505 ], type: 'Point' },
    name: 'Riviera Caterer'
  }
]

### Exercice 2 

#### Rechercher le nom du restaurant

```
db.neineighborhoodsg.find({name:"Hell'S Kitchen"});

```

``` 

db.neighborhoods.findOne({ "geometry": { $geoIntersects: { $geometry: { "type": "Point", "coordinates": [ -73.98241999999999, 40.579505 ] } } } }, { "name": 1,"_id":0 })

```
Renvoi

{ name: 'Seagate-Coney Island' }

Le nom du quartier du restaurant est Clinton

# Text Search
 
_MongoDB prend en charge les opérations de requête qui effectuent une recherche sémantique sur le contenu des chaînes de caractères. Pour effectuer une recherche textuelle, MongoDB utilise un index de texte et l'opérateur $text._
 
## <u>Création d'un jeu d'essai</u>
 
<u>Commandes: </u>
 
```bash
use stores
db.stores.insertMany(
    [
        {_id: 1, name: "Java Hut", description: "Coffee and cakes"},
        {_id: 2, name: "Burger Buns", description: "Gourmet hamburgers"},
        {_id: 3, name: "Coffee Shop", description: "Just coffee"},
        {_id: 4, name: "Clothes Clothes Clothes", description: "Discount clothing"},
        {_id: 5, name: "Java Shopping", description: "Indonesian goods"}
    ]
)
```
 
##  <u>Création d'un index de texte</u>
 
MongoDB fournit des index de texte afin de permettre d'effectuer des recherches sémantiques sur le contenu des chaînes de caractères. Ces index peuvent inclure n'importe quel champ de type string ou array de string. Pour effectuer ce type de recherche, **il faut créer un index de texte sur le champ de la collection**. Une collection ne peut avoir qu'un seul index de texte, mais cet index peut inclure plusieurs champs. Par exemple, pour créer un index de texte sur les champs `name` et `description` de la collection stores, il faut utiliser la commande suivante:
 
```bash
db.stores.createIndex({ name: "text", description: "text" });
```
 
##  <u>L'operateur $text</u>
 
Vous pouvez utiliser l'opérateur de recherche `$text` pour effectuer des recherches textuelles sur un champ indexé de type string ou array de string. Par exemple, pour rechercher les documents qui contiennent le mot "coffee" dans le champ `name` ou `description`, il faut utiliser la commande suivante:
 
```bash
db.stores.find({ $text: { $search: "coffee" } });
```
 
### <u> Term Exclusion </u>
 
Pour exclure un mot, vous pouvez le 'marquer' avec un signe `-` (moins). Par exemple, pour rechercher les documents qui contiennent le mot "coffee" dans le champ `name` ou `description` mais pas le mot "shop", il faut utiliser la commande suivante:
 
```bash
db.stores.find({ $text: { $search: "coffee -shop" } });
```
 
### <u> Sort by Text Score </u>
 
L'opérateur `$text` attribue un score à chaque document qui contient les termes de recherche. Le score représente la pertinence d'un document par rapport à la recherche. MongoDB retourne les documents triés par ordre décroissant du score de pertinence. Le score de pertinence est le nombre de fois que le terme de recherche apparaît dans le document. Afin de trier les résultats dans l'ordre du score de pertinence, vous devez explicitement projeter le champ `$meta:textScore` et utiliser la méthode `sort()`.
 
```bash
db.stores.find ({
  $text: {
    $search: "java coffee shop"
  }
}, {
  score: {
    $meta: "textScore"
  }
}).sort({
  score: {
    $meta: "textScore"
  }
});
```
 
Exercice:
 
Récupérez le jeu de données suivant:
 
[Lien](https://124492699-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/assets%2F-MSOt80X0hisISagHUcn%2F-MT530f32heVh6pbC-yL%2F-MT5GBX4l_aq7_jYugje%2FlistingsAndReviews.rar?alt=media&token=6ff79e5f-b538-4597-a200-4c957618939d&__cf_chl_tk=zgqBwDADaEcFfz7Yn2JzYNJLLhQhF91NHABL61wiLqc-1706690847-0-gaNycGzNECU)
 
Consignes :
 
- importez le jeu d'essai, décrivez le
```bash
docker cp listingsAndReviews.json mongo:/data/listingsAndReviews.json
 
docker exec -it mongo /bin/bash
 
mongoimport --db stores --collection listingsAndReviews --jsonArray --type json --file /data/listingsAndReviews.json
```
 
Les documents importés correspondent à des données d'annonces du site airbnb, on y retrouve toute les informations liés à la publication de l'annonce comme par exemple, le prix, les images, l'adresses, etc.. Il y a énormément de donnée, ce qui fait penser qu'elles ont été récupérer grâce à un script de scraping.
 
- créer un index de text sur les champs `summary`, `description` et `name`
```bash
db.listingsAndReviews.createIndex({ summary: "text", description: "text", name: "text" });
```
 
- Lister tous les appartements contenant le terme `duplex`
```bash
db.listingsAndReviews.find({
  $text : {
    $search: "duplex"
  }
}, {
  "_id": 0,
  "name": 1,
}).sort({
  score: {
    $meta: "textScore"
  }
})
```
 
- Compter le nombre d'appartements qui possède un lit `king size`
```bash
db.listingsAndReviews.aggregate([{
  $match: {
    $text: {
      $search: "king size"
    }
  }
}, {
  $group: {
    _id: 0,
    "countDocuments": {
      $sum: 1
    }
  }
}])
```
 
- Compter combien d'appartements ont pour description `cozy, studio` mais pas `furnish` (a partir de cette étape supprimez l'index et le placer uniquement sur la description)
```bash
db.listingAndReviews.find({
  "description": {
    $text: {
      $search: "cozy studio -furnish"
    }
  }
}, {
  $group: {
    _id: 0,
    "countDocuments": {
      $sum: 1
    }
  }
})
```
 
```bash
db.listingAndReviews.find({
  "description": {
    $match: {
      $search: "cozy studio -furnish"
    }
  }
}, {
  $group: {
    _id: 0,
    "countDocuments": {
      $sum: 1
    }
  }
})
```
 
```bash
 
db.listingAndReviews.countDocuments({
  description: {
    $all: [
      { $regex: "cozy" },
      { $regex: "studio" }
    ],
    $not: {
      $regex: "furnish"
    }
  }
})
# Exercices sur les index géographiques
 
## Exercice 1
 
Vous disposez du code JavaScript suivant qui comporte :
- une fonction de conversion d’une distance exprimée en kilomètres vers des radians
- un document dont les coordonnées serviront de centre à notre sphère de recherche.
 
Écrivez la requête qui affichera le nom des salles situées dans un rayon de 60 kilomètres et qui programment du Blues et de la Soul.
 
```json
var KilometresEnRadians = function(kilometres){ var rayonTerrestreEnKm = 6371;
return kilometres / rayonTerrestreEnKm;
};
var salle = db.salles.findOne({"adresse.ville": "Nîmes"});
var requete = { ... };
db.salles.find(requete ... };
```
 
```json
var rayonEnKilometres = 60;
 
var KilometresEnRadians = function(kilometres) {
  var rayonTerrestreEnKm = 6371;
  return kilometres / rayonTerrestreEnKm;
};
 
var salle = db.salles.findOne({"adresse.ville": "Nîmes"});
 
var requete = {
  "adresse.coordinates": {
    $geoWithin: {
      $centerSphere: [[ salle.adresse.coordinates[0], salle.adresse.coordinates[1]],
        KilometresEnRadians(rayonEnKilometres)
      ]
    },
  },
  $or: [
    { "programmation.genres": "Blues"},
    { "programmation.genres": "Soul"}
  ]
};
 
var resultats = db.salles.find(requete).toArray();
printjson(resultats);
```
 
## Exercice 2
 
Écrivez la requête qui permet d’obtenir la ville des salles situées dans un rayon de 100 kilomètres autour de Marseille, triées de la plus proche à la plus lointaine :
 
```json
var marseille = {"type": "Point", "coordinates": [43.300000, 5.400000]}
 db.salles.find(...)
```
 
```js
var marseille = {"type": "Point", "coordinates": [43.300000, 5.400000]}
 
db.salles.createIndex({"adresse.localisation": "2dsphere"})
 
db.salles.find({
  "adresse.localisation": {
    $nearSphere: {
      $geometry: marseille,
      $maxDistance: 100000
    }
  }
}, {
  "adresse.ville": 1,
  "_id": 0
})
```

Soit un objet GeoJSON de la forme suivante :
 
```json
var polygone = {
  type: "Polygon",
  coordinates: [
    [
      [43.94899, 4.80908],
      [43.95292, 4.80929],
      [43.95174, 4.8056],
      [43.94899, 4.80908],
    ],
  ],
};
```
 
Donnez le nom des salles qui résident à l’intérieur.
 
```js
var polygone = {
  type: "Polygon",
  coordinates: [
    [
      [43.94899, 4.80908],
      [43.95292, 4.80929],
      [43.95174, 4.8056],
      [43.94899, 4.80908],
    ],
  ],
};
 
var requete = ({
  "adresse.localisation": {
    $geoWithin: {
      $geometry: polygone,
    }
  }
}, {
  "_id": 0,
  "nom": 1
})
 
var resultats = db.salles.find(requete).toArray()
printjson(resultats)
 
Télécharger les jeux d'essais suivants :
https://raw.githubusercontent.com/mongodb/docs-assets/geospatial/restaurants.json
https://raw.githubusercontent.com/mongodb/docs-assets/geospatial/neighborhoods.json
 
```bash
docker cp restaurants.json mongo:/data/restaurants.json
docker cp neighborhoods.json mongo:/data/neighborhoods.json
 
docker exec -it mongo /bin/bash
 
mongoimport --db geo --collection restaurants --file /data/restaurants.json
mongoimport --db geo --collection neighborhoods --file /data/neighborhoods.json
```
 
Creation d'un index 2dsphere Un index géospatial, et améliore presque toujours les performances des requêtes $geoWithin et $geoIntersects. Comme ces données sont géographiques, créez un index2dsphère sur chaque collection en utilisant le shell mongo :
 
```bash
db.restaurants.createIndex({"location": "2dsphere"})
db.neighborhoods.createIndex({"geometry": "2dsphere"})
```
 
Attention, la création d'un index est OBLIGATOIRE pour permettre l'utilisation des arguments :$geoIntersects, $geoSphere, $geoNear, $geoWithin, $centerSphere, $nearSphere , etc...
 
Explorez les données, documentez votre démarche et vos résultats dans un fichier geo_exo_suite_suite.md
 
Trouvez la commande qui va retourner le restaurant Riviera Caterer... De quel type d'objet GeoJSON s'agit-il ?
 
```bash
db.restaurants.find({
  "name": {
    $eq: "Regina Caterers"
  }
}, {
  "_id": 0,
  "name": 1
})
```
 
Trouvez "Hell'S Kitchen" au sein de la collection "restaurants" et retournez le nom du quartier, sa superficie et sa population. Quelle est la superficie totale de ce quartier ? (optionnel)
 
```bash
db.restaurants.find({
  "name": {
    $eq: "Hell'S Kitchen"
  }
}, {
  "_id": 0,
  "name": 1
})
 
db.neightborhoods.aggregate([
  {
    $project: {
      name: 1,
      superficie: { $polygonArea: ["$geometry.coordinates"]}
    }
  }
])
```
 
Trouvez la requete type qui permet de recuperer le nom du quartier a partir d'un point donné.
 
```bash
db.neighborhoods.find({
  "geometry": {
    $geoIntersects: {
      $geometry: {
        "type": "Point",
        "coordinates": [ -73.98241999999999, 40.579505 ]
      }
    }
  }
}, {
   "name": 1,
   "_id": 0
})
```
 
Trouver la requête qui trouve les restaurants dans un rayon donné (8km par exemple)
 
```bash
db.restaurants.find({
   "location": {
     $nearSphere: {
       $geometry: {
         "type": "Point",
         "coordinates": [ -73.98241999999999, 40.579505 ]
       },
       $maxDistance: 8000
     }
   }
}, {
  "_id": 0,
  "name": 1
})
```
ou
```bash
db.restaurants.find({
  "location": {
    $geoWithin : {
      $centerSphere: [[ -73.98241999999999, 40.579505 ], 8 / 6378.1]
    }
  }
}, {
  "_id": 0,
  "name": 1
})
 
