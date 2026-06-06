import { useEffect, useState } from "react";
import * as service from "../services/recomendationService";

export default function useDailyRecommendations(userId, dosha) {
    const [dailyRecommendations, setDailyRecommendations] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadDailyRecommendations = async () => {
        if (!userId || !dosha) return;

        try {
            setIsLoading(true);
            setError(null);

            const data =
                await service.getOrCreateDailyRecommendations(userId, dosha);

            setDailyRecommendations(data);
        } catch (err) {
            console.error("Error loading daily recommendations", err);
            setError(err.message || "Failed to load daily recommendations");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDailyRecommendations();
    }, [userId, dosha]);

    return {
        dailyRecommendations,
        isLoading,
        error,
        loadDailyRecommendations,
    };
}