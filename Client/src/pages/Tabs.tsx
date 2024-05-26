import React from "react";
import Amis from "./Amis";
import Discussions from "./Discussions";
import Reglages from "./Reglages";
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { chatbubblesOutline, cogOutline, peopleOutline, caretForwardCircleOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import Informations from "./Informations";
import Messages from "./Messages";
import Chat from "./Messagerie";
import StoryPage from "./StoryPage";

const Tabs: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/app">
                    <Redirect to={"/app/discussions"} />
                </Route>
                <Route exact path="/app/friends" component={Amis} />
                <Route exact path="/app/discussions" component={Discussions} />
                <Route exact path="/app/reglages" component={Reglages} />
                <Route exact path="/app/informations" component={Informations} />
                <Route exact path="/app/messages/:id" component={Messages} />
                <Route exact path="/app/chat/:userId/:friendId" component={Chat} />
                <Route path="/app/story" component={StoryPage} exact={true} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="friends" href="/app/friends">
                    <IonIcon icon={peopleOutline} />
                    <IonLabel>Amis</IonLabel>
                </IonTabButton>
                <IonTabButton tab="discussions" href="/app/discussions">
                    <IonIcon icon={chatbubblesOutline} />
                    <IonLabel>Groupes</IonLabel>
                </IonTabButton>
                <IonTabButton tab="story" href="/app/story">
                    <IonIcon icon={caretForwardCircleOutline} />
                    <IonLabel>Story</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default Tabs;
