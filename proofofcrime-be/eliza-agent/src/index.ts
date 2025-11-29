import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting ElizaOS Agent...');

// Parse command line arguments to get the character file
const args = process.argv.slice(2);
const characterArg = args.find(arg => arg.startsWith('--character='));

if (characterArg) {
    const characterPath = characterArg.split('=')[1];
    console.log(`Loading character from: ${characterPath}`);

    try {
        const fullPath = path.resolve(process.cwd(), characterPath);
        if (fs.existsSync(fullPath)) {
            const characterData = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
            console.log(`Character loaded: ${characterData.name || 'Unknown'}`);
        } else {
            console.warn(`Character file not found at: ${fullPath}`);
        }
    } catch (error) {
        console.error('Error loading character file:', error);
    }
} else {
    console.log('No character file specified.');
}

console.log('Agent is running. Press Ctrl+C to exit.');

// Keep the process alive
setInterval(() => {
    // Heartbeat
}, 10000);
