import React, { useEffect, useState } from 'react';

import {
    Cell,
    Div,
    Group,
    Panel,
    PanelHeader,
    PanelHeaderButton,
    PanelSpinner,
    Title,
} from "@vkontakte/vkui";
import StandardPlaceholder from '../../components/StandardPlaceholder';

import { Icon28SlidersOutline } from '@vkontakte/icons';

import { useDispatch, useSelector } from 'react-redux';

import { setData } from '../../store/data/actions';
import { setPage } from '../../store/router/actions';

import { getTimetable } from '../../API/functions';
import { IStore } from '../../store/reducers';
import { icons } from '../../data/icons';
import { hexToRGB } from '../../data/colors';
import Days from '../../components/Days';
import { days } from '../../data/more';

interface IProps {
    id: string,
    snackbar: JSX.Element | null,
}

export default function HomePanelBase(props: IProps) {
    const { id, snackbar } = props;

    const timetable = useSelector((store: IStore) => store.data.timetable);
    const activeDay = useSelector((store: IStore) => store.data.timetableActiveDay);
    const lessons = useSelector((store: IStore) => store.data.lessons);
    const teachers = useSelector((store: IStore) => store.data.teachers);

    const [loader, setLoader] = useState(!timetable["monday"]);
    const [error, setError] = useState(false);

    const dispatch = useDispatch();

    const mount = (type: number = 0) => {
        if(!timetable["monday"] || type === 1) {
            (async () => {
                const status = await getTimetable();
                setLoader(false);
                if(!status) return setError(true);
            })();
        }
        const unmount = () => {

        }
        return unmount;
    }

    useEffect(() => mount(), []);

    function openEdit() {
        dispatch(setData("editTimetable", JSON.parse(JSON.stringify(timetable))));
        dispatch(setPage("home", "edit"));
    }

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderButton disabled={loader} onClick={() => openEdit()}><Icon28SlidersOutline /></PanelHeaderButton>}>Расписание</PanelHeader>
            {/* TODO: PullToRefresh */}
            <Group>
                {loader ? <PanelSpinner /> : !error && <>
                    <Days type="base" />
                    <Div>
                        <Title level="1" weight="heavy" style={{ paddingBottom: 8 }}>
                            {days[activeDay].full}
                        </Title>
                        {timetable[days[activeDay].key].length === 0 && <StandardPlaceholder type="noLessons" onClick={() => openEdit()} />}
                    </Div>
                    {timetable[days[activeDay].key].map((item) => <Cell
                        disabled
                        before={<div className="icon" style={{ fill: hexToRGB(lessons[item].color, 1), backgroundColor: hexToRGB(lessons[item].color, 0.1) }}>{icons[lessons[item].icon].icon}</div>}
                        description={(lessons[item].cabinet === null ? "" : "Кабинет №" + lessons[item].cabinet + " • ") + (teachers[lessons[item].teacher] ? teachers[lessons[item].teacher].label : "загрузка...")}
                    >
                        {lessons[item].name}
                    </Cell>)}
                </>}

                {error && <StandardPlaceholder type="noInternet" onClick={() => {
                    setLoader(true);
                    setError(false);
                    mount(1);
                }} />}
            </Group>
            {snackbar}
        </Panel>
    )
}