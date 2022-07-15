export default function (dataUser = {}, action) {
  if (action.type == 'addUser') {
    return action.dataUser
  } else if (action.type === 'clearUser') {
    return {}
  } else {
    return dataUser
  }
}
