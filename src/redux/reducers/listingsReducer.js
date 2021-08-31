const defaultState = []

export default function listingsReducer (state = defaultState, action)  {
    switch (action.type) {
        case 'ADD_LISTING':
            return [...state, action.payload]
        case 'ADD_MANY_LISTINGS':
            return [...state, ...action.payload]
        default:
            return state
    }
}