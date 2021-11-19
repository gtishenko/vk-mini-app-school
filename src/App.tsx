import React, { useEffect, useState } from 'react';

import {
    Epic,
    View,
    Root,
    ModalRoot,
    ConfigProvider,
    AdaptivityProvider,
    AppRoot,
    TabbarItem,
    Tabbar,
    SplitLayout,
    PanelHeader,
    SplitCol,
    Group,
    Cell,
    Panel,
    Platform,
    WebviewType
} from "@vkontakte/vkui";

import HomePanelBase from './js/panels/home/base';
import HomePanelEdit from './js/panels/home/edit';
import HomePanelSelectLesson from './js/panels/home/selectLesson';

import HomeworkPanelBase from './js/panels/homework/base';

import ProfilePanelBase from './js/panels/profile/base';

import ClassPanelBase from './js/panels/class/base';

import CreateLessonFirstModal from './js/components/modals/CreateLessonFirstModal';
import CreateLessonSecondModal from './js/components/modals/CreateLessonSecondModal';

import { Icon28CalendarOutline, Icon28Profile, Icon28SchoolOutline, Icon28WriteSquareOutline } from '@vkontakte/icons';

import { goBack, setStory, closeModal } from './js/store/router/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IStore } from './js/store/reducers';
import { getActivePanel } from './js/services/functions';

import noConnection from "./images/no-connection.svg";
import { setData } from './js/store/data/actions';

export default function App() {
    const vk_platform: string | null = new URLSearchParams(window.location.search).get("vk_platform");
    
    const [platform, setPlatform] = useState(Platform.VKCOM);
    const [lastAndroidBackAction, setLastAndroidBackAction] = useState(0);
    const [history, setHistory] = useState<any>(undefined);
    const [popout, setPopout] = useState<any>(null);

    const activeView = useSelector((store: IStore) => store.router.activeView);
    const activeStory = useSelector((store: IStore) => store.router.activeStory);
    const panelsHistory = useSelector((store: IStore) => store.router.panelsHistory);
    const activeModals = useSelector((store: IStore) => store.router.activeModals);
    const popouts = useSelector((store: IStore) => store.router.popouts);
    const scrollPosition = useSelector((store: IStore) => store.router.scrollPosition);
    const activePanel = useSelector((store: IStore) => store.router.activePanel);
    const activeSnackbar = useSelector((store: IStore) => store.router.activeSnackbar);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setData("vk_platform", vk_platform));
        if (vk_platform === 'mobile_web' || vk_platform === 'desktop_web') setPlatform(Platform.VKCOM);
        else if (vk_platform === 'mobile_android' || vk_platform === 'mobile_android_messenger') setPlatform(Platform.ANDROID);
        else setPlatform(Platform.IOS);

        window.onpopstate = () => {
            let timeNow = +new Date();

            if (timeNow - lastAndroidBackAction > 500) {
                setLastAndroidBackAction(timeNow);

                dispatch(goBack());
            } else {
                window.history.pushState(null, null!);
            }
        };
    }, []);

    useEffect(() => {
        let pageScrollPosition: number | null = scrollPosition[activeStory + "_" + activeView + "_" + activePanel];

        if(pageScrollPosition) window.scroll(0, pageScrollPosition);
    }, [activeView, activePanel, activeStory]);

    useEffect(() => {
        setPopout((popouts[activeView!] === undefined) ? null : popouts[activeView!]);
    }, [popouts, activeView]);

    useEffect(() => {
        setHistory((panelsHistory[activeView!] === undefined) ? [activeView] : panelsHistory[activeView!]);
    }, [panelsHistory, activeView]);
    
    const activeModal: string | null | undefined = activeModals[activeView!];

    const homeModals: any = (
        <ModalRoot activeModal={activeModal}>
            <CreateLessonFirstModal
                id="CREATE_LESSON_FIRST_MODAL"
                onClose={() => dispatch(closeModal())}
            />
            <CreateLessonSecondModal
                id="CREATE_LESSON_SECOND_MODAL"
                onClose={() => dispatch(closeModal())}
            />
        </ModalRoot>
    );

    const isDesktop: boolean = vk_platform === "desktop_web";
    const hasHeader: boolean = vk_platform !== "desktop_web";

    return (
        <ConfigProvider platform={platform} webviewType={vk_platform === "desktop_web" ? WebviewType.INTERNAL : WebviewType.VKAPPS} isWebView={true} >
            <AdaptivityProvider>
                <AppRoot>
                    <img alt="no-connection" src={noConnection} style={{ display: "none" }}/>
                    <SplitLayout
                        header={hasHeader && <PanelHeader separator={false} />}
                        style={{ justifyContent: "center" }}
                        modal={homeModals}
                        popout={popout}
                    >
                        {isDesktop && (
                            <SplitCol fixed width="280px" maxWidth="280px">
                                <Panel>
                                    {hasHeader && <PanelHeader />}
                                    <Group>
                                        <Cell
                                            disabled={activeStory === 'home'}
                                            style={activeStory === 'home' ? {
                                                backgroundColor: "var(--button_secondary_background)",
                                                borderRadius: 8
                                            } : {}}
                                            before={<Icon28CalendarOutline />}
                                            onClick={() => dispatch(setStory("home", "base"))}
                                        >
                                            Главная
                                            </Cell>
                                        <Cell
                                            disabled={activeStory === 'homework'}
                                            style={activeStory === 'homework' ? {
                                                backgroundColor: "var(--button_secondary_background)",
                                                borderRadius: 8
                                            } : {}}
                                            before={<Icon28WriteSquareOutline />}
                                            onClick={() => dispatch(setStory("homework", "base"))}
                                        >
                                            Домашние задания
                                        </Cell>
                                        <Cell
                                            disabled={activeStory === 'profile'}
                                            style={activeStory === 'profile' ? {
                                                backgroundColor: "var(--button_secondary_background)",
                                                borderRadius: 8
                                            } : {}}
                                            before={<Icon28Profile />}
                                            onClick={() => dispatch(setStory("profile", "base"))}
                                        >
                                            Профиль
                                        </Cell>
                                        <Cell
                                            disabled={activeStory === 'class'}
                                            style={activeStory === 'class' ? {
                                                backgroundColor: "var(--button_secondary_background)",
                                                borderRadius: 8
                                            } : {}}
                                            before={<Icon28SchoolOutline />}
                                            onClick={() => dispatch(setStory("class", "base"))}
                                        >
                                            Мой класс
                                        </Cell>
                                    </Group>
                                </Panel>
                            </SplitCol>
                        )}

                        <SplitCol
                            animate={!isDesktop}
                            spaced={isDesktop}
                            width={isDesktop ? '560px' : '100%'}
                            maxWidth={isDesktop ? '560px' : '100%'}
                        >
                            <Epic activeStory={activeStory!} tabbar={!isDesktop &&
                                <Tabbar>
                                    <TabbarItem
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => dispatch(setStory('home', 'base'))}
                                        selected={activeStory === 'home'}
                                        text="Расписание"
                                    >
                                        <Icon28CalendarOutline />
                                    </TabbarItem>
                                    <TabbarItem
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => dispatch(setStory('homework', 'base'))}
                                        selected={activeStory === 'homework'}
                                        text="Домашка"
                                    >
                                        <Icon28WriteSquareOutline />
                                    </TabbarItem>
                                    <TabbarItem
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => dispatch(setStory('profile', 'base'))}
                                        selected={activeStory === 'profile'}
                                        text="Профиль"
                                    >
                                        <Icon28Profile />
                                    </TabbarItem>
                                    <TabbarItem
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => dispatch(setStory('class', 'base'))}
                                        selected={activeStory === 'class'}
                                        text="Мой класс"
                                    >
                                        <Icon28SchoolOutline />
                                    </TabbarItem>
                                </Tabbar>
                            }>
                                <Root id="home" activeView={activeView!}>
                                    <View
                                        id="home"
                                        activePanel={getActivePanel("home")}
                                        history={history}
                                        onSwipeBack={() => dispatch(goBack())}
                                    >
                                        <HomePanelBase id="base" snackbar={activeSnackbar} />
                                        <HomePanelEdit id="edit" snackbar={activeSnackbar} />
                                        <HomePanelSelectLesson id="selectLesson" snackbar={activeSnackbar} />
                                    </View>
                                </Root>
                                <Root id="homework" activeView={activeView!}>
                                    <View
                                        id="homework"
                                        activePanel={getActivePanel("homework")}
                                        history={history}
                                        onSwipeBack={() => dispatch(goBack())}
                                    >
                                        <HomeworkPanelBase id="base" snackbar={activeSnackbar} />
                                    </View>
                                </Root>
                                <Root id="profile" activeView={activeView!}>
                                    <View
                                        id="profile"
                                        activePanel={getActivePanel("profile")}
                                        history={history}
                                        onSwipeBack={() => dispatch(goBack())}
                                    >
                                        <ProfilePanelBase id="base" snackbar={activeSnackbar} />
                                    </View>
                                </Root>
                                <Root id="class" activeView={activeView!}>
                                    <View
                                        id="class"
                                        activePanel={getActivePanel("class")}
                                        history={history}
                                        onSwipeBack={() => dispatch(goBack())}
                                    >
                                        <ClassPanelBase id="base" snackbar={activeSnackbar} />
                                    </View>
                                </Root>
                            </Epic>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    )
}

export var noConnectionImage = noConnection;