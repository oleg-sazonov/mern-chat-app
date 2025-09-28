/**
 * useNotificationSound Hook
 * -------------------------
 * Custom hook for managing and playing a shared notification sound.
 *
 * Purpose:
 *   - Provides a reusable mechanism to play a notification sound in response to events.
 *   - Ensures the sound is preloaded and unlocked for playback in browsers with autoplay restrictions.
 *
 * Exports:
 *   - useNotificationSound: Hook that returns a `playNotification` function to play the sound.
 *
 * Dependencies:
 *   - `notificationSound`: The path to the notification sound file.
 *
 * State:
 *   - `sharedAudio`: A shared `HTMLAudioElement` instance for playing the notification sound.
 *   - `unlocked`: A flag indicating whether the audio has been unlocked for playback.
 *   - `lastPlayTs`: A timestamp of the last time the sound was played (used for debouncing).
 *
 * Functions:
 *   - ensureSharedAudio():
 *       - Creates and returns a shared `HTMLAudioElement` instance if it doesn't already exist.
 *       - Configures the audio element with preload, volume, and playback settings.
 *   - playNotification():
 *       - Plays the notification sound if it has been unlocked and debouncing conditions are met.
 *       - Resets the audio playback position before playing to ensure the sound starts from the beginning.
 *
 * Effects:
 *   - Unlocks the audio on the first user interaction (click or keydown) to comply with browser autoplay policies.
 *   - Cleans up event listeners when the component using the hook unmounts.
 *
 * Error Handling:
 *   - Logs warnings if the audio unlock or playback fails (in development mode).
 *
 * Usage:
 *   - Import and use this hook in components or other hooks to play a notification sound.
 *
 * Example:
 *   - Import and use in a component:
 *       const { playNotification } = useNotificationSound();
 *       playNotification(); // Plays the notification sound
 */

import { useEffect, useCallback } from "react";
import notificationSound from "../../assets/sounds/notification.mp3";

let sharedAudio = null;
let unlocked = false;
let lastPlayTs = 0;

function ensureSharedAudio() {
    if (sharedAudio) return sharedAudio;
    sharedAudio = new Audio(notificationSound);
    sharedAudio.preload = "auto";
    sharedAudio.volume = 0.35;
    sharedAudio.crossOrigin = "anonymous";
    sharedAudio.playsInline = true;
    console.log("sharedAudio created");
    return sharedAudio;
}

export const useNotificationSound = () => {
    useEffect(() => {
        ensureSharedAudio();

        const unlock = async () => {
            if (unlocked || !sharedAudio) return;
            // Mark as unlocked immediately to prevent parallel calls
            unlocked = true;
            try {
                await sharedAudio.play();
                sharedAudio.pause();
                sharedAudio.currentTime = 0;
                console.log("audio unlocked (once)");
            } catch (err) {
                // if play failed, we can try again on next user interaction
                console.warn("unlock attempt failed:", err);
            }
        };

        window.addEventListener("click", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });

        return () => {
            window.removeEventListener("click", unlock);
            window.removeEventListener("keydown", unlock);
        };
    }, []);

    const playNotification = useCallback(() => {
        const audio = ensureSharedAudio();
        const now = Date.now();
        if (now - lastPlayTs < 100) return;
        lastPlayTs = now;
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.play().catch(() => {});
        } catch (err) {
            if (import.meta.env.DEV)
                console.debug("notification play failed", err);
        }
    }, []);

    return { playNotification };
};

export default useNotificationSound;
