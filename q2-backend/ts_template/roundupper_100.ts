import express from "express";

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number; y: number };
type spaceCowboy = { name: string; lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy"; metadata: spaceCowboy; location: location }
    | { type: "space_animal"; metadata: spaceAnimal; location: location };

// === ADD YOUR CODE BELOW :D ===

// spaceAnimalEntity models a space_animal entity object.
type spaceAnimalEntity = { type: "space_animal"; metadata: spaceAnimal; location: location };

// spaceCowboyEntity models a space_cowboy entity object.
type spaceCowboyEntity = { type: "space_cowboy"; metadata: spaceCowboy; location: location };

// returnAnimal models a space_animal entity however only containing the metadata.type and location.
type returnAnimal = { type: string; location: location };

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
const port = 8080;

// middleware to parse incoming JSON requests
app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post("/entity", (req, res) => {
    try {
        const { entities } = req.body;
        for (const entity of entities) {
            // checking if the entities passed in are valid
            if (!validEntity(entity)) {
                return res.sendStatus(400);
            }
            // entity is valid so can push to dB.
            spaceDatabase.push(entity);
        }
        return res.sendStatus(200);
    } catch (err) {
        return res.sendStatus(400);
    }
});

// /lassoable returns all the space animals a space cowboy can lasso given their name
app.get("/lassoable", (req, res) => {
    const cowboy_name = req.query.cowboy_name;
    // getting the cowboy object from dB
    const [cowboy_obj] = spaceDatabase.filter(entity => entity.type === 'space_cowboy' && entity.metadata.name === cowboy_name) as spaceCowboyEntity[];

    // making sure that the name passed in corresponds to a cowboy
    if (cowboy_obj === undefined) {
        return res.status(400).send('Invalid cowboy name!');
    }

    // collecting all the space animals that are lassoable
    let animals_arr = spaceDatabase.filter(entity => entity.type === 'space_animal' && lassoable(cowboy_obj, entity)) as spaceAnimalEntity[];

    const nearbyAnimals = [] as returnAnimal[];

    // going through each animal in animals_arr and pushing the returnAnimal object into nearbyAnimals.
    for (const animal of animals_arr) {
        nearbyAnimals.push({ type: animal.metadata.type, location: animal.location })
    }

    return res.status(200).json({ "space_animals": nearbyAnimals });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS BELOW:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// helper function which will take an input entity and checks if it matches the 
// the spaceEntity type.
function validEntity(entity: any): boolean {
    if (entity.type === 'space_cowboy') {
        if (typeof entity.metadata.name === 'string' && typeof entity.metadata.lassoLength === 'number') {
            if (typeof entity.location.x !== 'number' || typeof entity.location.y !== 'number') {
                return false;
            }
        } else {
            return false;
        }
    } else if (entity.type === 'space_animal') {
        // checks if the type of space_animal is either a pig, cow or flying burger
        if (["pig", "cow", "flying_burger"].includes(entity.metadata.type as string)) {
            if (typeof entity.location.x !== 'number' || typeof entity.location.y !== 'number') {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

// helper function which checks if the animal is lassoable 
function lassoable(cowboy: spaceEntity, animal: spaceEntity): boolean {
    // using distance formula to find the distance between the two entities
    let distance = Math.sqrt((animal.location.x - cowboy.location.x) ** 2 + (animal.location.y - cowboy.location.y) ** 2);

    let cowboyMeta = cowboy.metadata as spaceCowboy;
    // checking if animal within length of lasso
    return (distance <= cowboyMeta.lassoLength ? true : false);
}
