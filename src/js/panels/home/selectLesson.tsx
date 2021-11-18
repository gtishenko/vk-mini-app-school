import React from 'react';

import {
    Button,
    Div,
    FixedLayout,
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelHeaderButton,
    SimpleCell
} from "@vkontakte/vkui";

import { goBack, openModal } from '../../store/router/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IStore } from '../../store/reducers';
import { icons } from '../../data/icons';
import { Icon28AddCircleOutline } from '@vkontakte/icons';
import StandardPlaceholder from '../../components/StandardPlaceholder';
import { resetCreateLessonData, setData } from '../../store/data/actions';
import { store } from '../../../index';
import { days } from '../../data/more';

interface IProps {
    id: string,
    snackbar: JSX.Element | null
}

export default function HomePanelSelectLesson(props: IProps) {
    const { id, snackbar } = props;

    const lessonsKey = useSelector((store: IStore) => store.data.lessonsKey);
    const lessons = useSelector((store: IStore) => store.data.lessons);
    const platform = useSelector((store: IStore) => store.data.vk_platform);
    const editTimetableActiveDay = useSelector((store: IStore) => store.data.editTimetableActiveDay);
    const editTimetable = useSelector((store: IStore) => store.data.editTimetable);

    const dispatch = useDispatch();

    function clickLesson(id: string) {
        let timetable = JSON.parse(JSON.stringify(editTimetable));
        timetable[days[editTimetableActiveDay].key].push(id);
        dispatch(setData("editTimetable", timetable));
        dispatch(goBack());
    }

    function createLesson() {
        dispatch(resetCreateLessonData());
        dispatch(openModal("CREATE_LESSON_FIRST_MODAL"));
    }

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => dispatch(goBack())} />} right={platform === "desktop_web" && <PanelHeaderButton onClick={() => createLesson()}><Icon28AddCircleOutline fill="var(--accent)" /></PanelHeaderButton>}>Выбор предмета</PanelHeader>
            <Group>
                {lessonsKey.length === 0 && <StandardPlaceholder type="noLessonsCreated" onClick={() => createLesson()} />}

                {lessonsKey.map((item, index) => <SimpleCell
                    before={<div className="lesson-cell-before" style={{ fill: lessons[item.key].color }}>
                        {icons[lessons[item.key].icon].icon}
                    </div>}
                    key={index}
                    expandable
                    onClick={() => clickLesson(item.key)}
                >
                    {lessons[item.key].name}
                </SimpleCell>)}
            </Group>
            {platform !== "desktop_web" && lessonsKey.length !== 0 && <FixedLayout vertical="bottom">
                <Group>
                    <Div>
                        <Button
                            size="l"
                            before={<Icon28AddCircleOutline />}
                            mode="tertiary"
                            onClick={() => createLesson()}
                        >
                            Новый предмет
                        </Button>
                    </Div>
                </Group>
            </FixedLayout>}
            {snackbar}
        </Panel>
    )
}