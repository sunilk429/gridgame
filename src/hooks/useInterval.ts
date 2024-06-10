import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delay: number | null, isPaused: boolean, getLatestState: () => any) {
    const savedCallback = useRef<() => void>();
    const startTime = useRef<number | null>(null);
    const remainingTime = useRef<number>(0);

    useEffect(() => {
        savedCallback.current = () => {
            const latestState = getLatestState();
            callback(latestState);
        };
    }, [callback, getLatestState]);

    useEffect(() => {
        if (delay !== null && !isPaused) {
            const tick = () => {
                if (savedCallback.current) {
                    savedCallback.current();
                }
                remainingTime.current = 0;
                startTime.current = performance.now() + delay;
            };

            if (!startTime.current) {
                startTime.current = performance.now() + delay;
            }

            const timeoutId = window.setTimeout(tick, remainingTime.current);

            return () => {
                window.clearTimeout(timeoutId);
            };
        }
    }, [delay, isPaused]);

    useEffect(() => {
        if (isPaused && startTime.current) {
            remainingTime.current = startTime.current - performance.now();
            startTime.current = null;
        }
    }, [isPaused]);

    return null;
}

export default useInterval;