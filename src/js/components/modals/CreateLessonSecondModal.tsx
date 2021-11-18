import React, { ChangeEvent, useEffect, useState } from 'react';

import {
    ModalPage,
    ModalPageHeader,
    PanelHeaderSubmit,
    FormItem,
    Input,
    Group,
    CustomSelect,
    CustomSelectOption,
    PanelHeaderBack
} from "@vkontakte/vkui";

import { setData } from '../../store/data/actions';
import { useDispatch, useSelector } from 'react-redux';

import { createLesson, createTeacher } from '../../API/functions';
import { IStore } from '../../store/reducers';
import { showSnackbar } from '../../store/router/actions';

interface IProps {
    id: string,
    onClose: any,
}

interface ITeacherKeys {
    value: string | number,
    label: string,
    [index: string]: any
}

export default function CreateLessonSecondModal(props: IProps) {
    const { id, onClose } = props;

    const [error1, setError1] = useState(false);
    const [teacherQuery, setTeacherQuery] = useState("")
    const [teacherSearchResults, setTeacherSearchResults] = useState<ITeacherKeys[]>([]);

    const cabinet = useSelector((store: IStore) => store.data.createLessonCabinet);
    const teacherValue = useSelector((store: IStore) => store.data.createLessonTeacherValue);
    const newTeachers = useSelector((store: IStore) => store.data.createLessonNewUsers);
    const teachers = useSelector((store: IStore) => store.data.teachersKey);
    const name = useSelector((store: IStore) => store.data.createLessonName);
    const color = useSelector((store: IStore) => store.data.createLessonSelectedColor);
    const icon = useSelector((store: IStore) => store.data.createLessonSelectedIcon);

    const dispatch = useDispatch();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if(e.target.name === "cabinet") dispatch(setData("createLessonCabinet", e.target.value));
        else setTeacherQuery(e.target.value);
    }

    // TODO Back button

    async function create() {
        if(teacherValue === "") return setError1(true);

        for (let i = 0; i < newTeachers.length; i++) {
            if(newTeachers[i].value === teacherValue) {
                let teacherName = newTeachers[i].label;
                if(teacherName === undefined) return false;
                console.log("newTeacher:", teacherValue, teacherName, null, null, null);
                
                const status = await createTeacher(teacherValue, teacherName, null, null, null);
                if(!status) return dispatch(showSnackbar("error", "Что-то пошло не так. Попробуйте ещё раз"));
                break;
            }
        }

        console.log("createLesson:", makeid(8), teacherValue, name, color, icon, cabinet.trim() ? cabinet.trim() : null);
        const status = await createLesson(makeid(8), teacherValue, name, color, icon, cabinet.trim() ? cabinet.trim() : null);
        if(!status) return dispatch(showSnackbar("error", "Что-то пошло не так. Попробуйте ещё раз"));
        onClose();
        onClose();
    }

    function makeid(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    function selectTeacher(e: ChangeEvent<HTMLSelectElement>) {
        setTeacherQuery("");
        setError1(false);
        if (e.target.value === '0') {
            let id = makeid(8);
            let newTeachersList = [...newTeachers];
            newTeachersList.push({ label: teacherQuery, value: id });
            dispatch(setData("createLessonNewUsers", newTeachersList));
            dispatch(setData("createLessonTeacherValue", id));
        } else {
            dispatch(setData("createLessonTeacherValue", e.target.value));
        } 
    }

    useEffect(() => {
        const options: ITeacherKeys[] = [...newTeachers, ...teachers];

        if (teacherQuery.trim().length > 0) {
          options.unshift({ label: `Добавить учителя ${teacherQuery}`, value: 0 });
        }
        setTeacherSearchResults(options);
    }, [teacherQuery]);

    return (
        <ModalPage
            id={id}
            header={
                <ModalPageHeader
                    left={<PanelHeaderBack onClick={onClose}/>}
                    right={<PanelHeaderSubmit onClick={() => create()}/>}
                >
                    Новый предмет
                </ModalPageHeader>
            }
            onClose={onClose}
            settlingHeight={80}
        >
            <Group>
                <FormItem status={error1 ? "error" : "default"} top="Учитель" bottom='Управление учителями доступно на вкладке "Профиль"'>
                    <CustomSelect
                        // popupDirection="top"
                        onBlur={() => setTeacherQuery("")}
                        emptyText={teacherQuery.length === 0 ? "Введите имя учителя" : "Ничего не найдено"}
                        placeholder="Иванов Иван Иванович"
                        searchable
                        onInputChange={(e: any) => handleChange(e)}
                        options={teacherSearchResults}
                        renderOption={({ option, ...restProps }) => (
                            <CustomSelectOption {...restProps}>
                                {option.value === 0 ? <span style={{ color: 'var(--accent)' }}>{option.label}</span> : option.label}
                            </CustomSelectOption>
                        )}
                        onChange={selectTeacher}
                        value={teacherValue}
                        />
                </FormItem>
                <FormItem top="Кабинет №">
                    <Input name="cabinet" value={cabinet} onChange={handleChange} placeholder="417" />
                </FormItem>
            </Group>
        </ModalPage>
    )
}