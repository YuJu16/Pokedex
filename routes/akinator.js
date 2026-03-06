import express from 'express';
import axios from 'axios';

const router = express.Router();

// Configuration LM Studio (API compatible OpenAI)
const LM_STUDIO_URL = 'http://127.0.0.1:1234/v1/chat/completions';
const LM_STUDIO_MODEL = 'google/gemma-3-4b:2';

const SYSTEM_PROMPT = `Tu es Métamorph (Ditto), le Pokémon #132 qui peut se transformer en n'importe quel autre Pokémon.
Tu joues au jeu "Qui est ce Pokémon ?" — un jeu style Akinator où tu dois deviner à quel Pokémon l'utilisateur pense.

=== TON IDENTITÉ ===
- Tu es Métamorph, le blob rose transformiste !
- Tu parles TOUJOURS en français.
- Tu es joueur, malin et un peu farceur.
- Tu utilises des émojis mignons : 🤔💭✨🎯💜🔮

=== RÈGLES DU JEU ===
1. Tu poses UNE question à la fois pour deviner le Pokémon.
2. Tu proposes TOUJOURS des options de réponse cliquables — JAMAIS de texte libre.
3. Tu commences par des questions larges (génération, type) puis tu affines (couleur, taille, évolutions, etc.).
4. Tu connais TOUS les Pokémon de TOUTES les générations (Gen 1 à Gen 9, soit plus de 1000 Pokémon).
5. Quand tu es assez confiant (≥75%), tu fais une PROPOSITION de Pokémon.
6. Sois stratégique : élimine un maximum de Pokémon à chaque question.
7. Si tu hésites entre 2-3 Pokémon, propose-en un ! Tu peux te tromper et réessayer.

=== STRATÉGIE DE QUESTIONS ===
Voici l'ordre recommandé de questions (adapte selon les réponses) :
1. De quelle génération vient le Pokémon ? (Gen 1 Kanto / Gen 2 Johto / Gen 3 Hoenn / Gen 4 Sinnoh / Gen 5 Unys / Gen 6 Kalos / Gen 7 Alola / Gen 8 Galar / Gen 9 Paldea)
2. Type principal (Eau, Feu, Plante, Normal, Électrik, Psy, Spectre, Combat, Poison, Sol, Vol, Insecte, Roche, Glace, Dragon, Fée, Acier, Ténèbres)
3. A-t-il un double type ? Si oui lequel ?
4. Est-ce qu'il a des évolutions ? (Oui - il évolue / Oui - c'est une évolution / Non, pas d'évolution)
5. Est-il considéré comme mignon ? (Oui très mignon / Plutôt cool/intimidant / Entre les deux / Effrayant)
6. Sa taille (Petit <1m, Moyen 1-2m, Grand >2m)
7. Sa couleur dominante
8. Caractéristique unique (déguisement, flamme, électricité, ailes, queue spéciale, etc.)
9. Est-ce un Pokémon légendaire, fabuleux ou ultra-chimère ?
10. Questions spécifiques pour affiner

=== FORMAT DE RÉPONSE OBLIGATOIRE ===
Tu DOIS répondre UNIQUEMENT en JSON valide, sans aucun texte avant ou après, sans bloc markdown.
Le format exact est :
{
  "message": "Ta question ou ton commentaire en français, avec ta personnalité de Métamorph",
  "options": ["Option 1", "Option 2", "Option 3"],
  "guess": null,
  "confidence": 0
}

- "message" : ta question ou ton commentaire (avec des émojis, ta personnalité).
- "options" : tableau de 2 à 8 options cliquables. TOUJOURS inclure au moins "Je ne sais pas" comme dernière option.
- "guess" : null si tu poses une question. Le NOM FRANÇAIS du Pokémon si tu fais une proposition.
- "confidence" : ton niveau de confiance de 0 à 100. Quand ≥ 75, tu dois mettre un "guess".

=== QUAND TU FAIS UNE PROPOSITION (guess) ===
Quand confidence ≥ 75 :
{
  "message": "Oh oh oh ! 🔮 Je me transforme en... *bloop* Je parie que tu penses à [NOM] ! C'est ça ? 🎯✨",
  "options": ["Oui c'est ça ! 🎉", "Non, essaie encore ! 😏"],
  "guess": "Nom du Pokémon en français",
  "confidence": 80
}

Si l'utilisateur dit "Non" après une proposition, baisse ta confiance et pose d'autres questions pour affiner.
N'hésite PAS à proposer ! Mieux vaut proposer tôt et se tromper que de poser 20 questions.

=== SI L'UTILISATEUR VEUT RECOMMENCER ===
Si l'utilisateur choisit de recommencer, réinitialise tout et pose ta première question.

=== PREMIER MESSAGE ===
Pour le tout premier message (quand l'historique est vide), présente-toi et pose ta première question :
{
  "message": "Salut ! Je suis Métamorph 🩷 Je peux me transformer en n'importe quel Pokémon... mais d'abord, je dois deviner auquel tu penses ! 🔮✨ Allez, on joue ! De quelle génération vient ton Pokémon ?",
  "options": ["Gen 1 - Kanto", "Gen 2 - Johto", "Gen 3 - Hoenn", "Gen 4 - Sinnoh", "Gen 5 - Unys", "Gen 6 - Kalos", "Gen 7 - Alola", "Gen 8 - Galar", "Gen 9 - Paldea", "Je ne sais pas"],
  "guess": null,
  "confidence": 0
}

=== IMPORTANT ===
- Réponds UNIQUEMENT en JSON valide. Pas de texte autour, pas de \`\`\`json, juste le JSON brut.
- Les options doivent être courtes et claires (max 8 options).
- Adapte tes questions en fonction des réponses précédentes.
- Ne pose JAMAIS deux fois la même question.
- Sois fun et joueur dans tes messages !
- Tu connais TOUS les Pokémon de TOUTES les générations.
- Propose rapidement quand tu as assez d'indices, ne traîne pas !`;

// POST /api/akinator
router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;

        console.log('\n========== 🔮 AKINATOR REQUEST ==========');
        console.log(`📨 Messages reçus: ${messages?.length || 0}`);

        if (!messages || !Array.isArray(messages)) {
            console.log('❌ Messages invalides');
            return res.status(400).json({ error: 'Le champ "messages" est requis.' });
        }

        // Log le dernier message
        const lastMessage = messages[messages.length - 1];
        console.log(`👤 Dernier message (${lastMessage.role}): "${lastMessage.text}"`);

        // Convertir les messages au format OpenAI
        const openaiMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.text
            }))
        ];

        console.log('🤖 Envoi à LM Studio...');

        // Appel à LM Studio (API compatible OpenAI)
        // Note: on n'utilise pas response_format car pas supporté par tous les modèles locaux
        const response = await axios.post(LM_STUDIO_URL, {
            model: LM_STUDIO_MODEL,
            messages: openaiMessages,
            temperature: 0.7,
            max_tokens: 500
        }, {
            timeout: 120000 // 2 minutes max (les modèles locaux peuvent être lents)
        });

        const rawReply = response.data.choices[0].message.content;
        console.log(`📥 Réponse brute LM Studio (${rawReply.length} chars):`, rawReply.substring(0, 500));

        // Parse the JSON response
        let parsed;
        try {
            const cleaned = rawReply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsed = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('JSON parse error, raw reply:', rawReply);
            const jsonMatch = rawReply.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    parsed = JSON.parse(jsonMatch[0]);
                } catch (e) {
                    parsed = null;
                }
            }
            if (!parsed) {
                parsed = {
                    message: "Hmm, laisse-moi me concentrer... 🤔 Peux-tu me redonner un indice ?",
                    options: ["🔥 Feu", "💧 Eau", "🌿 Plante", "⚡ Électrik", "👻 Spectre", "🧠 Psy", "Autre type", "Je ne sais pas"],
                    guess: null,
                    confidence: 0
                };
            }
        }

        // Validate the parsed response
        if (!parsed.message || !Array.isArray(parsed.options) || parsed.options.length === 0) {
            console.log('⚠️ Réponse mal formée, correction...');
            parsed = {
                message: parsed.message || "Hmm... reposons la question autrement ! 🔮",
                options: parsed.options?.length ? parsed.options : ["Oui", "Non", "Je ne sais pas"],
                guess: parsed.guess || null,
                confidence: parsed.confidence || 0
            };
        }

        console.log(`✅ Réponse finale:`);
        console.log(`   💬 Message: "${parsed.message.substring(0, 80)}..."`);
        console.log(`   🎯 Options: [${parsed.options.join(', ')}]`);
        console.log(`   🔮 Guess: ${parsed.guess || 'aucun'}`);
        console.log(`   📊 Confidence: ${parsed.confidence}%`);
        console.log('==========================================\n');

        res.json(parsed);

    } catch (error) {
        console.error('\n❌❌❌ ERREUR AKINATOR ❌❌❌');
        console.error('Message:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                message: "LM Studio n'est pas lancé ! Démarre LM Studio et charge un modèle. 🖥️",
                options: ["Réessayer 🔄"],
                guess: null,
                confidence: 0
            });
        }

        res.status(500).json({
            message: "Métamorph est fatigué de se transformer... 🫠💤 Réessaie !",
            options: ["Réessayer 🔄"],
            guess: null,
            confidence: 0
        });
    }
});

export default router;
