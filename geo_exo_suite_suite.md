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


