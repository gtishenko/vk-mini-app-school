import React from 'react';
import { noConnectionImage as noConnection } from "../../App";

import {
    Button,
    Placeholder
} from "@vkontakte/vkui";
import { Icon56InfoOutline } from '@vkontakte/icons';

type Types = "noInternet" | "noLessons" | "noLessonsEdit" |  "noLessonsCreated";

interface IProps {
    type: Types,
    onClick: any
}

export default function StandardPlaceholder(props: IProps): JSX.Element {
    const { type, onClick } = props;

    if (type === "noInternet") {
        return (
            <Placeholder
                icon={<img alt="no-connection" src={noConnection} width={150}/>}
                header="Не могу достучаться 💔"
                action={<Button onClick={onClick} size="m">Перезагрузить</Button>}
            >
                Похоже что-то случилось с вашим интернет-соединением. Пожалуйста, подождите или попробуйте позже
            </Placeholder>
        )
    } else if(type === "noLessons") {
        return (
            <Placeholder
                icon={<Icon56InfoOutline />}
                header="Тут ничего нет"
                action={<Button onClick={onClick} size="m">Редактировать расписание</Button>}
            >
                Заполните расписание, нажав на кнопку ниже
            </Placeholder>
        )
    } else if(type === "noLessonsEdit") {
        return (
            <Placeholder
                icon={<Icon56InfoOutline />}
                header="Тут ничего нет"
                action={<Button onClick={onClick} size="m">Добавить предмет</Button>}
            >
                Добавьте первый предмет в расписание, нажав на кнопку ниже
            </Placeholder>
        )
    } else {
        return (
            <Placeholder
                icon={<Icon56InfoOutline />}
                header="Тут ничего нет"
                action={<Button onClick={onClick} size="m">Новый предмет</Button>}
            >
                Добавьте первый предмет, нажав на кнопку ниже
            </Placeholder>
        );
    }
}