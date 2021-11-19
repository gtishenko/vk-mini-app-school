import React, { useEffect, useState } from 'react';

import {
    Group,
    Header,
    Panel,
    PanelHeader,
    PanelSpinner,
    SimpleCell,
    Switch,
    Title
} from "@vkontakte/vkui";

import { useSelector } from 'react-redux';
import { IStore } from '../../store/reducers';
import { getTimetable } from '../../API/functions';
import { Icon28EducationOutline, Icon28Users3Outline } from '@vkontakte/icons';

interface IProps {
    id: string,
    snackbar: JSX.Element | null
}

export default function ProfilePanelBase(props: IProps) {
    const { id, snackbar } = props;

    const timetable = useSelector((store: IStore) => store.data.timetable);

    const [loader, setLoader] = useState(!timetable["monday"]);
    const [error, setError] = useState(false);

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

    return (
        <Panel id={id}>
            <PanelHeader>Профиль</PanelHeader>
            {loader ? <PanelSpinner /> : <>
                <Group>
                    <SimpleCell before={<Icon28Users3Outline />} expandable>Мои одноклассники</SimpleCell>
                    <SimpleCell before={<Icon28EducationOutline />} expandable>Мои учителя</SimpleCell>
                </Group>
                <Group header={<Header mode="primary">Другое</Header>}>
                    <SimpleCell disabled after={<Switch />} description="Напоминания о домашней работе">Включить уведомления</SimpleCell>
                    <SimpleCell expandable>Настроить предметы</SimpleCell>
                </Group>
            </>}
            {snackbar}
        </Panel>
    )
}