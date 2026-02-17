// Script de test pour l'authentification
import fetch from 'node-fetch'; // Vous devrez peut-être installer ce package

const API_URL = 'http://localhost:3000/api';

async function testAuth() {
    console.log('🧪 Test de l\'authentification JWT\n');

    // 1. Inscription d'un utilisateur
    console.log('📝 Test 1: Inscription...');
    try {
        const registerResponse = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'sacha', password: 'pikachu' })
        });
        const registerData = await registerResponse.json();
        console.log('✅ Inscription:', registerData);
    } catch (error) {
        console.error('❌ Erreur inscription:', error.message);
    }

    // 2. Connexion
    console.log('\n🔑 Test 2: Connexion...');
    let token;
    try {
        const loginResponse = await fetch(`$ {API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'sacha', password: 'pikachu' })
        });
        const loginData = await loginResponse.json();
        token = loginData.token;
        console.log('✅ Connexion réussie! Token:', token.substring(0, 50) + '...');
    } catch (error) {
        console.error('❌ Erreur connexion:', error.message);
    }

    // 3. Tenter de créer un Pokémon SANS token
    console.log('\n🚫 Test 3: Créer un Pokémon sans token (doit échouer)...');
    try {
        const noAuthResponse = await fetch(`${API_URL}/pokemons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 999,
                name: { french: 'TestMon' },
                type: ['Electric'],
                base: { HP: 100, Attack: 100, Defense: 100, SpecialAttack: 100, SpecialDefense: 100, Speed: 100 },
                image: 'test.png'
            })
        });
        const noAuthData = await noAuthResponse.json();
        console.log(`${noAuthResponse.status === 401 ? '✅' : '❌'} Status: ${noAuthResponse.status} -`, noAuthData);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }

    // 4. Créer un Pokémon AVEC token
    console.log('\n✅ Test 4: Créer un Pokémon avec token (doit réussir)...');
    try {
        const withAuthResponse = await fetch(`${API_URL}/pokemons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: 999,
                name: { french: 'TestMon' },
                type: ['Electric'],
                base: { HP: 100, Attack: 100, Defense: 100, SpecialAttack: 100, SpecialDefense: 100, Speed: 100 },
                image: 'test.png'
            })
        });
        const withAuthData = await withAuthResponse.json();
        console.log(`${withAuthResponse.status === 201 ? '✅' : '❌'} Status: ${withAuthResponse.status} -`, withAuthData);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }

    // 5. Vérifier que les GET restent publics
    console.log('\n🌍 Test 5: GET /api/pokemons doit rester public...');
    try {
        const getResponse = await fetch(`${API_URL}/pokemons?limit=3`);
        const getData = await getResponse.json();
        console.log(`${getResponse.status === 200 ? '✅' : '❌'} Status: ${getResponse.status} - Récupéré ${getData.data.length} Pokémon`);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }

    console.log('\n✨ Tests terminés!\n');
}

testAuth();
