// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/cocktails.json', 'utf-8'));

// Region mappings based on cocktail name or origin
const exactRegionMap = {
    'margarita': 'North America',
    'paloma': 'North America',
    'mojito': 'Caribbean',
    'daiquiri': 'Caribbean',
    'piña colada': 'Caribbean',
    'pina colada': 'Caribbean',
    'caipirinha': 'South America',
    'pisco sour': 'South America',
    'negroni': 'Europe',
    'aperol spritz': 'Europe',
    'manhattan': 'North America',
    'martini': 'North America',
    'old fashioned': 'North America',
    'moscow mule': 'North America',
    'espresso martini': 'Europe',
    'singapore sling': 'Asia',
    'irish coffee': 'Europe',
    'bloody mary': 'Europe',
    'french 75': 'Europe',
    'cuba libre': 'Caribbean',
    'mai tai': 'North America',
    'zombie': 'North America',
    'dark and stormy': 'Caribbean',
    'dark \'n\' stormy': 'Caribbean',
    'tom collins': 'North America',
    'gimlet': 'Europe',
    'sidecar': 'Europe',
    'boulevardier': 'Europe', // Paris
    'vesper': 'Europe',
    'americano': 'Europe',
    'french martini': 'Europe', // Invented in NY (wait, NY is North America. Let's fix that)
    'white russian': 'Europe',
    'champagne cocktail': 'Europe',
    'bellini': 'Europe',
    'kir': 'Europe',
    'kir royale': 'Europe',
    'pimm\'s cup': 'Europe',
    'sangria': 'Europe',
    // ...
};

const ingredientRegionHints = {
    'tequila': 'North America',
    'mezcal': 'North America',
    'cachaça': 'South America',
    'cachaca': 'South America',
    'pisco': 'South America',
    'sake': 'Asia',
    'soju': 'Asia',
    'midori': 'Asia',
    'amaretto': 'Europe',
    'campari': 'Europe',
    'aperol': 'Europe',
    'prosecco': 'Europe',
    'champagne': 'Europe',
    'cognac': 'Europe',
    'armagnac': 'Europe',
    'ouzo': 'Europe',
    'irish cream': 'Europe',
    'baileys': 'Europe',
    'limoncello': 'Europe',
    'absinthe': 'Europe',
    'rum': 'Caribbean',
    'malibu': 'Caribbean',
    'cachaca': 'South America'
};

const ingredientFixes = {
    'coca-cola': 'Cola',
    'coca cola': 'Cola',
    'baileys irish cream': 'Baileys',
    'kahlua': 'Kahlúa',
    'jalapeno': 'Jalapeño',
    'pina colada mix': 'Piña Colada Mix',
    'creme de cacao': 'Crème de Cacao',
    'creme de cassis': 'Crème de Cassis',
    'creme de mure': 'Crème de Mûre',
    'creme de menthe': 'Crème de Menthe',
    'blue curacao': 'Blue Curaçao',
    'anejo rum': 'Añejo Rum',
    'j\u00e4germeister': 'Jägermeister',
};

function fixName(name) {
    if (!name) return name;
    let ln = name.trim().toLowerCase();
    if (ingredientFixes[ln]) return ingredientFixes[ln];
    return name.trim();
}

let modifiedCount = 0;
let regionCount = 0;

data.forEach(drink => {
    let oldRegion = drink.region;
    let newRegion = "North America"; // North America is basically the default in mixology for many classics unless we know otherwise

    const dName = drink.name.toLowerCase();

    // NY/North America overrides for explicitly known US classics not caught
    if (dName === 'french martini') exactRegionMap[dName] = 'North America'; // Balthazar NYC
    if (dName === 'bramble') exactRegionMap[dName] = 'Europe'; // Freds Club London
    if (dName === 'corpse reviver') exactRegionMap[dName] = 'Europe'; // Savoy London

    // 1. Try exact exact-name map matches
    if (exactRegionMap[dName]) {
        newRegion = exactRegionMap[dName];
    } else {
        // 2. Try partial name matches
        if (dName.includes('margarita')) newRegion = 'North America';
        else if (dName.includes('martini') || dName.includes('manhattan') || dName.includes('sour') && !dName.includes('amaretto') && !dName.includes('pisco')) newRegion = 'North America';
        else if (dName.includes('mojito') || dName.includes('daiquiri') || dName.includes('piña') || dName.includes('pina')) newRegion = 'Caribbean';
        else if (dName.includes('caipirinha')) newRegion = 'South America';
        else if (dName.includes('punch')) newRegion = 'Caribbean';
        else if (dName.includes('sling')) newRegion = 'Asia';
        else if (dName.includes('spritz') || dName.includes('negroni') || dName.includes('bramble') || dName.includes('russian')) newRegion = 'Europe';
        else {
            // 3. Fallback to ingredient hints
            const ings = drink.ingredients.map(i => i.name.toLowerCase());
            let detectedRegion = null;

            for (let ing of ings) {
                for (let key in ingredientRegionHints) {
                    if (ing.includes(key)) {
                        detectedRegion = ingredientRegionHints[key];
                        break;
                    }
                }
                if (detectedRegion) break;
            }

            if (detectedRegion) {
                newRegion = detectedRegion;
            } else if (drink.primarySpirit) {
                const ps = drink.primarySpirit.toLowerCase();
                if (ps === 'tequila' || ps === 'mezcal' || ps === 'bourbon' || ps === 'rye') newRegion = 'North America';
                else if (ps === 'rum') newRegion = 'Caribbean';
                else if (ps === 'cognac' || ps === 'amaretto' || ps === 'campari' || ps === 'gin' || ps === 'scotch') newRegion = 'Europe'; // Actually Gin is mostly European / UK. Let's make Gin cocktails European by default unless named otherwise!
            }
        }
    }

    if (drink.region !== newRegion) {
        drink.region = newRegion;
        regionCount++;
    }

    let ingChanged = false;
    drink.ingredients.forEach(ing => {
        let nName = fixName(ing.name);
        if (nName !== ing.name) {
            ing.name = nName;
            ingChanged = true;
        }
    });

    // Capitalize cocktail names that are all lowercase
    if (drink.name === drink.name.toLowerCase()) {
        drink.name = drink.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        ingChanged = true;
    }

    if (ingChanged) modifiedCount++;
});

fs.writeFileSync('./src/data/cocktails.json', JSON.stringify(data, null, 2));
console.log(`Updated regions for ${regionCount} cocktails.`);
console.log(`Fixed ingredients/details for ${modifiedCount} cocktails.`);
