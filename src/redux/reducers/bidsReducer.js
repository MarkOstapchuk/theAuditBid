const defaultState = {
    ownBid: {},
    bids: []
}


export default function bidsReducer (state = defaultState, action)  {
    switch (action.type) {
        case 'ADD_BID':
            return [...state, action.payload]
        case 'ADD_MANY_BIDS':
            return {...state, bids: [...action.payload]}
        case 'ADD_OWN_BID':
            return {...state, ownBid: {...action.payload}}
        default:
            return state
    }
}