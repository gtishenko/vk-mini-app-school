import bridge from '@vkontakte/vk-bridge';
import { setData } from '../store/data/actions';
import { store } from '../../index';

export async function createLesson(key: string, teacher: string, name: string, color: string, icon: number, cabinet: number, timestamp: number) {
    let keys = [...store.getState().data.keys];

    interface INewLesson {
        teacher: string,
        name: string,
        color: string,
        icon: number,
        cabinet: number,
        timestamp: number
    }

    let newLesson: INewLesson = {
        teacher: teacher, // id
        name: name, // lesson name
        color: color, // id of color
        icon: icon, // id of icon
        cabinet: cabinet, // number of cabintet
        timestamp: timestamp // time of creation for sorting
    };
    await bridge.send("VKWebAppStorageSet", { "key": "teacher_" + key, "value": JSON.stringify(newLesson) }).then(() => {
        keys.push("teacher_" + key);
        bridge.send("VKWebAppStorageSet", { "key": "keys", "value": JSON.stringify(keys) });

        store.dispatch(setData("keys", keys));

        let lessons = { ...store.getState().data.lessons };
        let lessonsKey = [...store.getState().data.lessonsKey];

        lessons[key] = {
            teacher: teacher,
            name: name,
            color: color,
            icon: icon,
            cabinet: cabinet,
        };
        lessonsKey.push({ key: key, timestamp: timestamp });

        store.dispatch(setData("lessons", lessons));
        store.dispatch(setData("lessonsKey", lessonsKey));
    }).catch((error) => {
        console.log(error);
        return false;
    });

    return true;
}

export async function createTeacher(key: string, label: string, email: string | null, phone: string | null, vk: string | null, timestamp: number) {
    let keys = [...store.getState().data.keys];

    interface INewTeacher {
        label: string, // label of a teacher(name)
        email: string | null, // email of a teacher
        phone: string | null, // phone of a teacher
        vk: string | null, // vk of a teacher
        timestamp: number
    }

    let newTeacher: INewTeacher = {
        label: label,
        email: email,
        phone: phone,
        vk: vk,
        timestamp: timestamp,
    };
    await bridge.send("VKWebAppStorageSet", { "key": "teacher_" + key, "value": JSON.stringify(newTeacher) }).then(() => {
        keys.push("teacher_" + key);
        bridge.send("VKWebAppStorageSet", { "key": "keys", "value": JSON.stringify(keys) });

        store.dispatch(setData("keys", keys));

        let teachers = { ...store.getState().data.teachers };
        let teachersKey = [...store.getState().data.teachersKey];

        teachers[key] = {
            label: label,
            email: email,
            phone: phone,
            vk: vk,
        };
        teachersKey.push({ key: key, timestamp: timestamp, label: label });

        store.dispatch(setData("teachers", teachers));
        store.dispatch(setData("teachersKey", teachersKey));
    }).catch((error) => {
        console.log(error);
        return false;
    });

    return true;
}

export async function getTimetable() {
    const promise = new Promise(async (resolve, reject) => {
        let keys: string[] = [];
        let standardKeys: string[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        await bridge.send("VKWebAppStorageGet", { "keys": ["keys"] }).then((data) => {
            if (data.keys[0].value !== "") {
                keys = JSON.parse(data.keys[0].value);
                store.dispatch(setData("keys", keys));
            }
        }).catch((error) => {
            reject(error);
        });

        await bridge.send("VKWebAppStorageGet", { "keys": [...standardKeys, ...keys] }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });

    interface ILessons {
        [key: string]: {
            teacher: string, // id of a teacher
            name: string, // lesson name
            color: string, // color HEX
            icon: number, // id of icon
            cabinet: number // number of cabintet
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
        key: string, // key(ID)
        timestamp: number, // date of creation(for sorting)
        label: string // label of a teacher(name)
    }

    interface ITimetable {
        [key: string]: string[]
    }

    let lessons: ILessons = {};
    let teachers: ITeachers = {};
    let lessonsKey: ILessonsKey[] = [];
    let teachersKey: ITeachersKey[] = [];
    let timetable: ITimetable = {};

    await promise.then((data: any) => {
        for (let i = 0; i < data.keys.length; i++) {
            if (data.keys[i].key.split("_")[0] === "lesson") {
                let key = data.keys[i].key.split("_")[1];
                let lesson = JSON.parse(data.keys[i].value);
                lessonsKey.push({ key: key, timestamp: lesson['timestamp'] });
                delete lesson['timestamp'];
                lessons[key] = lesson;
            } else if (data.keys[i].key.split("_")[0] === "teacher") {
                let key = data.keys[i].key.split("_")[1];
                let teacher = JSON.parse(data.keys[i].value);
                teachersKey.push({ key: key, timestamp: teacher['timestamp'], label: teacher['label'] });
                delete teacher['timestamp'];
                teachers[key] = teacher;
            } else {
                if (data.keys[i].value === "") data.keys[i].value = "[]";
                timetable[data.keys[i].key] = JSON.parse(data.keys[i].value);
            }
        }
    }).catch((error) => {
        console.log(error);
        return false;
    });

    store.dispatch(setData("timetable", timetable));
    store.dispatch(setData("lessons", lessons));
    store.dispatch(setData("teachers", teachers));

    store.dispatch(setData("lessonsKey", lessonsKey));
    store.dispatch(setData("teachersKey", teachersKey));

    return true;
}