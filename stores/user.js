const ReactEasyState = require('react-easy-state')
const store = ReactEasyState.store
const _ = require('lodash')
const UserAction = require('../actions/user')


const user = store({
    id: null,
    name: null,
    espacoUsado: 150,


    async setId(id) {
        if (!id) return
        user.id = id
        const userInfo = await UserAction.getUser(id)
        user.name = userInfo.name
        user.espacoUsado = userInfo.name
    },

    totalEspaco() {
        return user.espacoUsado;
    }
})

module.exports = user