'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
if (!apiKey) {
  throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function getAiAnalysis(data: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Tu es un consultant expert en stratégie marketing et gestion de restaurants.
    Les données suivantes représentent les ventes de menus sur une période donnée :

    Données: ${JSON.stringify(data)}

    Ta mission est de fournir une analyse claire, concise et orientée action pour un gérant non technicien.

    Tâches :
    1. Identifie les plats les plus populaires et explique pourquoi ils séduisent les clients (prix, goût, accompagnement, habitude locale, etc.).
    2. Repère les plats qui se vendent le moins et propose des explications plausibles (prix trop élevé, manque de visibilité, combinaison peu attractive, etc.).
    3. Donne des recommandations concrètes pour augmenter les ventes des plats moins populaires :
      - promotions ciblées (ex: réductions temporaires),
      - suggestions de menus attractifs,
      - mise en avant visuelle ou orale par le personnel,
      - adaptation du menu (ajout/retrait/amélioration).
    4. Fournis des conseils pratiques pour optimiser les plats qui marchent déjà bien (fidélisation, upsell, ajustement des stocks).
    5. Si les données sont vides, analyse la situation (ex: aucun client sur la période, problème d’attractivité, jour férié, etc.) et propose des approches pour éviter ces journées creuses (ex: communication, offres spéciales, publicité locale).
    6. Sois concis (moins de 100 mots) mais percutant, avec un ton professionnel et pragmatique.

    Donne directement ton analyse, sans bla-bla inutile, sans salutation, sans transition inutile, sans titre, et fais en sorte que le gérant ressente immédiatement la pertinence de tes conseils.
  `;


  const result = await model.generateContent(prompt);
  return result.response.text();
}