import { useEffect } from "react";

// window shower
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