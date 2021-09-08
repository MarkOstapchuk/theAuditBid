import {useCallback, useEffect, useRef, useState} from "react";

export function secondsToDhms(miliseconds) {
    const seconds = (miliseconds/1000).toFixed();
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);

    const dDisplay = d > 0 ? d+"d " : "";
    const hDisplay = h > 0 ? h+"h " : "";
    const mDisplay = m > 0 ? m+"m" : "";
    if (dDisplay + hDisplay + mDisplay === '') {
        return seconds + 's'
    }
    return dDisplay + hDisplay + mDisplay;
}
export function useStateCallback(initialState) {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null); // init mutable ref container for callbacks

    const setStateCallback = useCallback((state, cb) => {
        cbRef.current = cb; // store current, passed callback in ref
        setState(state);
    }, []); // keep object reference stable, exactly like `useState`

    useEffect(() => {
        // cb.current is `null` on initial render,
        // so we only invoke callback on state *updates*
        if (cbRef.current) {
            cbRef.current(state);
            cbRef.current = null; // reset callback after execution
        }
    }, [state]);

    return [state, setStateCallback];
}