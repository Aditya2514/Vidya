import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const SOURCE_IMAGE = "C:\\Users\\adity\\.gemini\\antigravity\\brain\\261bfb1a-d5d6-4b2f-9e90-1c5b01c205f1\\premium_bookfinder_logo_1778503068896.png";
const PNG_OUTPUT = "C:\\Users\\adity\\OneDrive\\Desktop\\Vidya\\BookFinder\\logo_clean.png";

async function generateCleanPng() {
  const image = await Jimp.read(SOURCE_IMAGE);
  await image.write(PNG_OUTPUT);
  console.log("Clean PNG saved to " + PNG_OUTPUT);
}

generateCleanPng();
