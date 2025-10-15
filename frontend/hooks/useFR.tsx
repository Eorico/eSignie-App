import { useEffect } from "react";

declare global {
    interface Window {
        frameworkReady?: () => void;
    }
}

export function useFR() {
    useEffect(() => {
        window.frameworkReady?.();
    });
}