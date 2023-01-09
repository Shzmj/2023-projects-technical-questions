import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy", metadata: spaceCowboy, location: location }
    | { type: "space_animal", metadata: spaceAnimal, location: location };


// === ADD YOUR CODE BELOW :D ===

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
const port = 8080;

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    try {
        const { entities } = req.body;
        for (const entity of entities) {
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

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/locallassoable', (req, res) => {
    // TODO: fill me in
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// helper function which will take an input entity and checks if it matches the 
// the spaceEntity type.
function validEntity(entity: any) {
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