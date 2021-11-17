import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    HorizontalScroll,
    HorizontalCell,
    Title,
} from "@vkontakte/vkui";

import { IStore } from '../store/reducers';
import { setData } from '../store/data/actions';
import { days } from '../data/more';

type Types = "base" | "edit";

interface IProps {
    type: Types
}

export default function Days(props: IProps): JSX.Element {
    const { type } = props;
    const activeDay = useSelector((store: IStore) => type === "base" ? store.data.timetableActiveDay : store.data.editTimetableActiveDay);
    const daysScroll = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    function horizontalScroll(e: any) {
        let scrollLeft: string | null = e.target.scrollLeft;
        
        if(scrollLeft) {
            let next = Math.floor((Number.parseInt(scrollLeft) + 50) / (71 * days.length) * days.length);
            if(activeDay !== next) {
                if(type === "base") dispatch(setData("timetableActiveDay", next));
                else dispatch(setData("editTimetableActiveDay", next));
            }
        }
    }

    function clickMark(index: number, type: number = 0) {
        if(daysScroll.current) {
            daysScroll.current.scrollTo({
                left: index * 71,
                behavior: type === 0 ? "smooth" : "auto"
            });
        }
        // bridge.send("VKWebAppTapticSelectionChanged", {});
    }

    useEffect(() => {
        clickMark(activeDay, 1);
    }, []);

    return (
        <HorizontalScroll
            getRef={daysScroll}
            onScroll={horizontalScroll}
            className="days"
            showArrows
            getScrollToLeft={i => i - 71}
            getScrollToRight={i => i + 71}
        >
            <div className="display-flex">
                {days.map((item, index) => <HorizontalCell
                    className={(index === days.length-1 ? "last " : "") + (index === activeDay ? "activeCell" : "")}
                    onClick={() => clickMark(index)}
                >
                    <div className="daySelect">
                        <Title level="2" weight="heavy">
                            {item.abbreviated}
                        </Title>
                    </div>
                </HorizontalCell>)}
            </div>
        </HorizontalScroll>
    );
}