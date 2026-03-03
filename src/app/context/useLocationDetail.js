"use client"
import { useEffect, useState } from "react"

export const useLocationDetail = () => {
    const [countryCode, setCountryCode] = useState(null);
    const [countryData, setCountryData] = useState(null)

    useEffect(() => {
        const fetchGeoInfo = async () => {
            fetch('https://ipinfo.io/json')
                .then(function (response) {
                    response.json().then(jsonData => {
                        setCountryCode(jsonData?.country);
                        setCountryData(jsonData)
                    });
                })
                .catch(function (error) {
                    console.log({ error })
                });
        };

        fetchGeoInfo();
    }, []);
    return {
        countryCode,
        countryData
    }
}