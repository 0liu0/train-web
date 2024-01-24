import {createStore} from 'vuex'

const store = createStore({
    state: {
        member: JSON.parse(sessionStorage.getItem('member')) ||
            JSON.parse(localStorage.getItem('member')) ||
            {},
        SEAT_COL_ARRAY: [{code:"A",desc:"A",type:"1"},{code:"C",desc:"C",type:"1"},{code:"D",desc:"D",type:"1"},{code:"F",desc:"F",type:"1"},{code:"A",desc:"A",type:"2"},{code:"B",desc:"B",type:"2"},{code:"C",desc:"C",type:"2"},{code:"D",desc:"D",type:"2"},{code:"F",desc:"F",type:"2"}]
    },

    getters: {
        getMember: (state) => {
            return state.member;
        },
    },
    mutations: {
        setMemberToSessionStorage(state, member) {
            state.member = member
            sessionStorage.setItem('member', JSON.stringify(member))
        },
        setMemberToLocalStorage(state, member) {
            state.member = member
            localStorage.setItem('member', JSON.stringify(member))
        }
    },
    actions: {},
    modules: {}
})
export default store;
