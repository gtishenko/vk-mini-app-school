import { RESET_CREATE_LESSON_DATA, SET_DATA } from './actionTypes';
import { colors } from '../../data/colors';

interface INewTeachers {
    value: string, // key(ID)
    label: string // label of a teacher(name)
}

interface ILessons {
    [key: string]: {
        teacher: string, // id of a teacher
        name: string, // lesson name
        color: string, // color HEX
        icon: number, // id of icon
        cabinet: string | null // number of cabintet
    }
}

interface ITeachers {
    [key: string]: {
        label: string, // label of a teacher(name)
        email: string | null, // email of a teacher
        phone: string | null, // phone of a teacher
        vk: string | null, // vk of a teacher
    }
}

interface ILessonsKey {
    key: string, // key(ID)
    timestamp: number // date of creation(for sorting)
}

interface ITeachersKey {
    value: string, // key(ID)
    timestamp: number, // date of creation(for sorting)
    label: string // label of a teacher(name)
}

export interface ITimetable {
    [key: string]: string[]
}

export interface IDataReducer {
    vk_platform: string,

    timetable: ITimetable,
    editTimetable: ITimetable,

    lessons: ILessons,
    lessonsKey: ILessonsKey[],

    teachers: ITeachers,
    teachersKey: ITeachersKey[],

    keys: string[],

    timetableActiveDay: number,
    editTimetableActiveDay: number,

    createLessonSelectedColor: string,
    createLessonSelectedIcon: number,
    createLessonName: string,
    createLessonTeacherValue: string,
    
    createLessonCabinet: string,
    createLessonNewUsers: INewTeachers[],
}

export const initialState: IDataReducer = {
    vk_platform: "",

    timetable: {},
    editTimetable: {},

    lessons: {},
    lessonsKey: [],

    teachers: {},
    teachersKey: [],

    keys: [],

    timetableActiveDay: 0,
    editTimetableActiveDay: 0,

    createLessonSelectedColor: colors[0],
    createLessonSelectedIcon: 0,
    createLessonName: "",
    createLessonTeacherValue: "",
    createLessonCabinet: "",
    createLessonNewUsers: [],
};

interface IAction {
    readonly type: string,
    readonly payload: {
        variable: string,
        value: any
    }
}

export const dataReducer = (state = initialState, action: IAction) => {

    switch (action.type) {

        case RESET_CREATE_LESSON_DATA: {
            return {
                ...state,
                createLessonSelectedColor: colors[0],
                createLessonSelectedIcon: 0,
                createLessonName: "",
                createLessonTeacherValue: "",
                createLessonNewUsers: [],
                createLessonCabinet: "",
            };
        }

        case SET_DATA: {
            return {
                ...state,
                [action.payload.variable]: action.payload.value
            };
        }

        default: {
            return state;
        }

    }

};