import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import {
    ModalPage,
    ModalPageHeader,
    PanelHeaderClose,
    usePlatform,
    ANDROID,
    Div,
    PanelHeaderSubmit,
    FormItem,
    Input,
    Group
} from "@vkontakte/vkui";

import { icons } from '../../data/icons';
import { colors } from '../../data/colors';
import { setData } from '../../store/data/actions';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../store/router/actions';
import { IStore } from '../../store/reducers';

interface IProps {
    id: string,
    onClose: any,
}

export default function CreateLessonFirstModal(props: IProps) {
    const { id, onClose } = props;

    const name = useSelector((store: IStore) => store.data.createLessonName);
    const activeColor = useSelector((store: IStore) => store.data.createLessonSelectedColor);
    const activeIcon = useSelector((store: IStore) => store.data.createLessonSelectedIcon);

    const [inputError, setInputError] = useState(false);
    const [selectColorHeight, setSelectColorHeight] = useState(0);
    const [selectIconHeight, setSelectIconHeight] = useState(0);

    const selectColor = useRef<HTMLDivElement>(null);
    const selectIcon = useRef<HTMLDivElement>(null);

    const platform = usePlatform();
    const dispatch = useDispatch();

    useEffect(() => {
        if(selectColor && selectColor.current) {
            setSelectColorHeight(selectColor.current.clientWidth);
        }
    }, [selectColor]);

    useEffect(() => {
        if(selectIcon && selectIcon.current) {
            setSelectIconHeight(selectIcon.current.clientWidth);
        }
    }, [selectIcon]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        dispatch(setData("createLessonName", e.target.value));
    }

    return (
        <ModalPage
            id={id}
            header={
                <ModalPageHeader
                    left={platform === ANDROID &&
                    <PanelHeaderClose onClick={onClose} />}
                    right={<PanelHeaderSubmit onClick={() => {
                        if(name.trim().length !== 0) {
                            dispatch(setData("createLessonSelectedColor", activeColor));
                            dispatch(setData("createLessonSelectedIcon", activeIcon));
                            dispatch(setData("createLessonName", name));
                            dispatch(openModal("CREATE_LESSON_SECOND_MODAL"));
                        } else setInputError(true);
                    }}/>}
                >
                    Новый предмет
                </ModalPageHeader>
            }
            onClose={onClose}
            settlingHeight={80}
        >
            <Group>
                <Div className="create-lesson-first-page">
                    <div className="iconPreview" style={{ fill: activeColor }}>
                        {icons[activeIcon].icon}
                    </div>
                    <FormItem status={inputError ? "error" : undefined} className="create-lesson-form-item">
                        <Input value={name} onChange={handleChange} align="center" placeholder="Название" />
                    </FormItem>
                    <div className="select-item">
                        {colors.map((item, index) => <div
                            key={index}
                            ref={selectColor}
                            className={activeColor === item ? "selectColor active" : "selectColor"}
                            style={{ backgroundColor: item, height: selectColorHeight }}
                            onClick={() => dispatch(setData("createLessonSelectedColor", item))}
                        />)}
                    </div>
                    <div className="select-item">
                        {icons.map((item, index) => <div ref={selectIcon} onClick={() => dispatch(setData("createLessonSelectedIcon", index))} key={index} className={activeIcon === index ? "selectIcon active" : "selectIcon"} style={{ height: selectIconHeight }}>
                            {item.icon}
                        </div>)}
                    </div>
                </Div>
            </Group>
        </ModalPage>
    )
}