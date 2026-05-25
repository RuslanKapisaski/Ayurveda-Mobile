import useFetch from "./useFetch";
import * as foodScanningService from "../services/foodScanningService"
import { useCallback, useState } from "react";

export function useFetchHistoryScans(userId) {
    const [scans, setScans] = useState([])

    const { execute: loadScans, isLoading, error } = useFetch(
        useCallback(async () => {
            const result = await foodScanningService.getAllByUser(userId)
            setScans(result)
        }, [userId]))


    return { scans, loadScans, isLoading, error }
}