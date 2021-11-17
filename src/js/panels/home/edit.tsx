import React, { useRef } from 'react';

import {
    Button,
    Cell,
    Div,
    Group,
    HorizontalCell,
    HorizontalScroll,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelHeaderButton,
    ScreenSpinner,
    Title,
} from "@vkontakte/vkui";
import StandardPlaceholder from '../../components/StandardPlaceholder';

import { useDispatch, useSelector } from 'react-redux';

import { setData } from '../../store/data/actions';
import { setPage, goBack, openPopout, closePopout, showSnackbar } from '../../store/router/actions';

import { IStore } from '../../store/reducers';
import { Icon28DoneOutline } from '@vkontakte/icons';
import { store } from '../../../index';
import Days from '../../components/Days';
import { days } from '../../data/more';
import { saveTimetable } from '../../API/functions';

interface IProps {
    id: string,
    snackbar: JSX.Element | null,
}

export default function HomePanelEdit(props: IProps) {
    const { id, snackbar } = props

    const timetable = useSelector((store: IStore) => store.data.editTimetable);
    const activeDay = useSelector((store: IStore) => store.data.editTimetableActiveDay);
    const lessons = useSelector((store: IStore) => store.data.lessons);
    const teachers = useSelector((store: IStore) => store.data.teachers);
    const platform = useSelector((store: IStore) => store.data.vk_platform);

    const dispatch = useDispatch();

    async function save() {
        dispatch(openPopout(<ScreenSpinner />))

        const status = await saveTimetable(timetable);

        dispatch(closePopout());
        
        if(status) dispatch(showSnackbar("success", "Расписание успешно сохранено!"));
        else dispatch(showSnackbar("error", "Что-то пошло не так. Попробуйте ещё раз"));
    }

    const edited = JSON.stringify({...store.getState().data.timetable}) !== JSON.stringify({...store.getState().data.editTimetable});

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => dispatch(goBack())} />}
                right={platform === "desktop_web" && <PanelHeaderButton disabled={!edited} onClick={() => save()}><Icon28DoneOutline fill="var(--accent)" /></PanelHeaderButton>}
            >
                Редактирование
            </PanelHeader>
            <Group>
                <Days type="edit" />
                <Div>
                    <Title level="1" weight="heavy" style={{ paddingBottom: 8 }}>
                        {days[activeDay].full}
                    </Title>
                    {timetable[days[activeDay].key].length === 0 && <StandardPlaceholder type="noLessonsEdit" onClick={() => dispatch(setPage("home", "selectLesson"))} />}
                </Div>
                <div>
                    {timetable[days[activeDay].key].map((item, index) => <Cell
                        disabled
                        key={item}
                        removable
                        onRemove={() => {
                            let editTimetable = JSON.parse(JSON.stringify(timetable));
                            editTimetable[days[activeDay].key].splice(index, 1);
                            dispatch(setData("editTimetable", editTimetable));
                        }}
                        draggable
                        onDragFinish={({ from, to }) => {
                            let draggingList = [...timetable[days[activeDay].key]];
                            
                            draggingList.splice(from, 1);
                            draggingList.splice(to, 0, timetable[days[activeDay].key][from]);

                            let editTimetable = JSON.parse(JSON.stringify(timetable));
                            editTimetable[days[activeDay].key] = draggingList;
                            dispatch(setData("editTimetable", editTimetable));
                        }}
                        description={(lessons[item].cabinet === null ? "" : "Кабинет №" + lessons[item].cabinet + " • ") + (teachers[lessons[item].teacher] ? teachers[lessons[item].teacher].label : "загрузка...")}
                    >
                        {lessons[item].name}
                    </Cell>)}
                    {timetable[days[activeDay].key].length !== 0 && <Div>
                    <Button className="mt-8" size="l" mode="secondary" stretched onClick={() => dispatch(setPage("home", "selectLesson"))}>Добавить предмет</Button>
                </Div>}
                </div>
            </Group>
            {snackbar}
        </Panel>
    )
}