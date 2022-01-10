// Action
export const updateUserAction = 'UPDATE_USER';
export const clearUserAction = 'CLEAR_USER';
// Action Creator
export const updateUser = (user) => ({ type: updateUserAction, payload: user });
export const clearUser = () => ({ type: clearUserAction });

const initialState = { user: null };

function updateUserReducer(state = initialState, action) {
  // reducer가 이 action을 참조하는지 체크
  if (action.type === updateUserAction) {
    // 만약 참조한다면, state를 복사
    console.log(action.payload);
    return {
      ...state,
      // 그리고 새로운 값을 업데이트 해준다.
      user: { ...state.user, ...action.payload },
    };
  } else if (action.type === clearUserAction) {
    return {
      user: null,
    };
  }
  // 위 조건에 해당되지 않으면 그냥 기존 state값을 리턴해준다.
  return state;
}
export default updateUserReducer;
