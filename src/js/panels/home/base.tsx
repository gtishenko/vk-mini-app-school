import React from 'react';

import {
    Group,
    Panel,
    PanelHeader,
} from "@vkontakte/vkui";

interface IProps {
    id: string,
    snackbar: JSX.Element | null,
}

export default function HomePanelBase(props: IProps) {
    const { id, snackbar } = props;

    return (
        <Panel id={id}>
            <PanelHeader>Главная</PanelHeader>
            <Group>
                
            </Group>
            {snackbar}
        </Panel>
    )
}