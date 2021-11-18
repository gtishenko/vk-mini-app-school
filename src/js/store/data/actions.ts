import { SET_DATA, RESET_CREATE_LESSON_DATA } from './actionTypes';

export const setData = (variable: string, value: any) => (
    {
        type: SET_DATA,
        payload: {
            variable: variable,
            value: value
        }
    }
);

export const resetCreateLessonData = () => (
    {
        type: RESET_CREATE_LESSON_DATA
    }
);