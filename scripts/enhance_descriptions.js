const fs = require('fs');
const path = require('path');

const apiKey = "";

const cocktailsPath = path.join(__dirname, '../src/data/cocktails.json');

async function enhanceCocktails() {
    const cocktailsData = fs.readFileSync(cocktailsPath, 'utf8');
    let cocktails = JSON.parse(cocktailsData);

    console.log(`Loaded ${cocktails.length} cocktails.`);

    let modified = false;

    for (let i = 0; i < cocktails.length; i++) {
        const cocktail = cocktails[i];

        // Check if we already processed it with the new model
        if (cocktail.seoEnhanced) {
            console.log(`[${i + 1}/${cocktails.length}] Skipping ${cocktail.name} - already enhanced with advanced model.`);
            continue;
        }

        console.log(`[${i + 1}/${cocktails.length}] Enhancing ${cocktail.name}...`);

        // Prepare prompt
        const prompt = `Write an engaging SEO meta description (about 150 to 200 characters) for the cocktail "${cocktail.name}". 
It MUST include a brief mention of its historical origin (if known) and vividly describe its flavor profile. 
Current ingredients: ${cocktail.ingredients.map(ing => ing.name).join(', ')}. 
Do not include any intro text like "Here is the description:", just output the raw description.`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error(`Error fetching from OpenAI for ${cocktail.name}: ${response.status} ${response.statusText}`);
                console.error(errorData);
                // Pause and then continue to avoid rate limiting loops
                await new Promise(resolve => setTimeout(resolve, 5000));
                continue;
            }

            const data = await response.json();
            const newDescription = data.choices[0].message.content.trim();

            console.log(`Old: ${cocktail.metaDescription}`);
            console.log(`New: ${newDescription}`);

            cocktail.metaDescription = newDescription;
            cocktail.seoEnhanced = true;
            modified = true;

            // Save periodically or after each to not lose progress on failure
            if (i % 10 === 0) {
                fs.writeFileSync(cocktailsPath, JSON.stringify(cocktails, null, 2));
            }

            // Small delay to avoid aggressive rate limits
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (e) {
            console.error(`Exception optimizing ${cocktail.name}:`, e);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    if (modified) {
        fs.writeFileSync(cocktailsPath, JSON.stringify(cocktails, null, 2));
        console.log("Finished enhancing descriptions and saved cocktails.json.");
    } else {
        console.log("No modifications were necessary.");
    }
}

enhanceCocktails().catch(console.error);
