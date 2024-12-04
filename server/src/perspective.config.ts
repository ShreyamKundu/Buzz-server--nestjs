import dotenv from 'dotenv';
dotenv?.config();
import { google } from 'googleapis';

const API_KEY = process.env.PERSPECTIVE_API_KEY;
const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

export const analyzeComment = async (comment: string) => {
    const client = await google.discoverAPI(DISCOVERY_URL) as any;

    const analyzeRequest = {
        comment: {
            text: comment,
        },
        requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            THREAT: {},
            INSULT: {},
            PROFANITY: {},
        },
    };

    try {
        const response = await client.comments.analyze({
            key: API_KEY,
            resource: analyzeRequest,
        });

        return {
            toxicityScore: response.data.attributeScores.TOXICITY.summaryScore.value,
            severeToxicityScore: response.data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
            insultScore: response.data.attributeScores.INSULT.summaryScore.value,
            threatScore: response.data.attributeScores.THREAT.summaryScore.value,
            profanityScore: response.data.attributeScores.PROFANITY.summaryScore.value,
        };
    } catch (error) {
        throw new Error("Error analyzing comment: " + error.message);
    }
};
