import React from "react";
import { SideBarWrapper } from "../../../../components/SideBarWrapper";
import { GridIcon } from "../../../../icons/GridIcon";
import { MagicStarIcon } from "../../../../icons/MagicStarIcon";
import { LeaderboardIcon } from "../../../../icons/LeaderboardIcon";
import { SystemStatusOutlineInfo1 } from "../../../../icons/SystemStatusOutlineInfo1";
import { TeacherIcon } from "../../../../icons/TeacherIcon";
import { Login2 } from "../../../../icons/Login2";
import "./style.css";

export type ActiveSidebarItem = 'dashboard' | 'dataQuest' | 'myQuests' | 'leaderboard' | 'lossPrediction' | 'learn';

interface SideBarProps {
  activeItem?: ActiveSidebarItem;
}

export const SideBar: React.FC<SideBarProps> = ({ activeItem = 'dashboard' }) => {
  return (
    <SideBarWrapper
      className="side-bar-instance"
      override={<MagicStarIcon className="icon-instance-node" />}
      plant="https://c.animaapp.com/0CJtXeA1/img/plant-1.svg"
      sideButtonsIcon={<GridIcon className="icon-instance-node" />}
      sideButtonsIcon1={
        <LeaderboardIcon className="icon-instance-node" />
      }
      sideButtonsIcon2={
        <SystemStatusOutlineInfo1 className="icon-instance-node" />
      }
      sideButtonsIcon3={<TeacherIcon className="icon-instance-node" />}
      sideButtonsIcon4={<Login2 className="icon-instance-node" />}
      sideButtonsState={activeItem === 'dashboard' ? "active" : "default"}
      dataQuestState={activeItem === 'dataQuest' ? "active" : "default"}
      myQuestsState={activeItem === 'myQuests' ? "active" : "default"}
      leaderboardState={activeItem === 'leaderboard' ? "active" : "default"}
      lossPredictionState={activeItem === 'lossPrediction' ? "active" : "default"}
      learnState={activeItem === 'learn' ? "active" : "default"}
    />
  );
}; 