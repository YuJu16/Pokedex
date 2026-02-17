// Test rapide de bcrypt
import bcrypt from 'bcrypt';

console.log('🧪 Test de bcrypt...\n');

try {
    const password = 'testpassword';
    console.log('1. Génération du salt...');
    const salt = await bcrypt.genSalt(10);
    console.log('✅ Salt généré:', salt.substring(0, 20) + '...');

    console.log('\n2. Hashage du mot de passe...');
    const hash = await bcrypt.hash(password, salt);
    console.log('✅ Hash généré:', hash.substring(0, 40) + '...');

    console.log('\n3. Comparaison...');
    const isValid = await bcrypt.compare(password, hash);
    console.log('✅ Validation:', isValid);

    console.log('\n✨ Bcrypt fonctionne correctement!\n');
} catch (error) {
    console.error('❌ Erreur bcrypt:', error);
    console.error('Stack:', error.stack);
}
