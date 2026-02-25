// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/cocktails.json', 'utf-8'));

const recipeOverrides = {
    'Bob Marley': {
        ingredients: [
            { name: 'Grenadine', measure: '1/3 oz' },
            { name: 'Banana Liqueur', measure: '1/3 oz' },
            { name: 'Crème de Menthe', measure: '1/3 oz' },
            { name: 'Overproof Rum', measure: '1/4 oz (Optional float)' },
        ],
        instructions: 'Carefully layer the ingredients in a shot glass in the following order: Grenadine at the bottom, Banana Liqueur in the middle, and Crème de Menthe on top. Optional: float a thin layer of overproof rum on top and carefully ignite.',
        glassware: 'Shot glass',
        primarySpirit: 'Liqueur',
        secondarySpirit: 'Rum',
        prepMethod: 'Layered',
        tasteTags: ['Sweet', 'Herbal', 'Strong'],
        alcoholStrength: 'Medium',
        metaTitle: 'Bob Marley Shot Recipe | Layered Shooter',
        metaDescription: 'Celebrate with the classic Bob Marley layered shot. Learn how to layer Grenadine, Banana Liqueur, and Crème de Menthe for the perfect red, yellow, and green drink.',
    }
};

let modifiedCount = 0;

data.forEach(drink => {
    if (recipeOverrides[drink.name]) {
        const override = recipeOverrides[drink.name];
        Object.assign(drink, override);
        modifiedCount++;
    }
});

fs.writeFileSync('./src/data/cocktails.json', JSON.stringify(data, null, 2));
console.log(`Successfully patched ${modifiedCount} cocktails.`);
