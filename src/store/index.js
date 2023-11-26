import {createStore} from 'vuex'

const store = createStore({
    state: {
        member: JSON.parse(sessionStorage.getItem('member')) ||
            JSON.parse(localStorage.getItem('member')) ||
            {}
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
