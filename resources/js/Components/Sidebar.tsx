import React, { useState } from "react";
import NavLink from "./NavLink";
import {
    Bell,
    Brain,
    BugIcon,
    Cog,
    CogIcon,
    Earth,
    Flower,
    Folder,
    HandCoins,
    Handshake,
    LayoutDashboard,
    Leaf,
    NotebookTextIcon,
    Tally5Icon,
    Tractor,
    Trees,
    User2,
    Wheat,
    WheatIcon,
    Wrench,
} from "lucide-react";
import { User } from "@/types";
// import "../../css/Sidebar.css";

type Props = {
    user: {
        pfp: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "admin" | "super admin";
    };
};

export default function Sidebar({ user }: Props) {
    const [isAllocationOpen, setIsAllocationOpen] = useState(false);
    const [isCommodityOpen, setIsCommodityOpen] = useState(false);
    const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
    const handleToggle = () => {
        setIsAllocationOpen((prev) => !prev);
    };
    const handleCommodityToggle = () => {
        setIsCommodityOpen((prev) => !prev);
    };
    const handleRecommendationToggle = () => {
        setIsCommodityOpen((prev) => !prev);
    };
    return (
        <div className="fixed mt-20 p-5 bg-white rounded-[1rem] ml-3 shadow max-w-[20rem]">
            <ul>
                <span className="ml-2 mb-4 text-sm text-slate-400">Main</span>
                <li className="text-m mb-5">
                    <NavLink
                        href={route("dashboard")}
                        active={route().current("dashboard")}
                    >
                        <div className="flex gap-2">
                            <LayoutDashboard size={20} />
                            Dashboard
                        </div>
                    </NavLink>
                </li>

                <span className="ml-2 mb-4 text-sm text-slate-400">List</span>
                {user.role === "super admin" && (
                    <li className="text-m">
                        <NavLink
                            href={route("users.index")}
                            active={route().current("users.index")}
                        >
                            <div className="flex gap-2">
                                <User2 size={20} />
                                User
                            </div>
                        </NavLink>
                    </li>
                )}
                <li className="text-m">
                    <NavLink
                        href={route("farmers.index")}
                        active={route().current("farmers.index")}
                    >
                        <div className="flex gap-2">
                            <Wheat size={20} />
                            Farmer
                        </div>
                    </NavLink>
                </li>
                <li
                    className="text-m"
                    onMouseEnter={() => setIsCommodityOpen(true)}
                    onMouseLeave={() => setIsCommodityOpen(false)}
                    onClick={handleCommodityToggle}
                >
                    <NavLink
                        href={route("commodities.index")}
                        active={route().current("commodities.index")}
                    >
                        <div className="flex gap-2">
                            <Leaf size={20} />
                            Commodity
                        </div>
                    </NavLink>
                </li>
                {isCommodityOpen && (
                    <ul
                        className={`relative left-[1rem] transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden inline-block ${
                            isCommodityOpen
                                ? "max-h-40 opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                        onMouseEnter={() => setIsCommodityOpen(true)}
                        onMouseLeave={() => setIsCommodityOpen(false)}
                    >
                        <li className="border-l-2">
                            <NavLink
                                href={route("allocation.type.index")}
                                active={route().current(
                                    "allocation.type.index"
                                )}
                                className="border-l-[1px] "
                            >
                                <div className="flex gap-2">
                                    <HandCoins size={20} />
                                    Category
                                </div>
                            </NavLink>
                        </li>
                        <li className="border-l-2">
                            <NavLink
                                href={route("allocation.type.index")}
                                active={route().current(
                                    "allocation.type.index"
                                )}
                                className="border-l-[1px] "
                            >
                                <div className="flex gap-2">
                                    <NotebookTextIcon size={19} />
                                    List
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                )}
                <li
                    className="text-m "
                    onMouseEnter={() => setIsAllocationOpen(true)}
                    onMouseLeave={() => setIsAllocationOpen(false)}
                    onClick={handleToggle}
                >
                    <NavLink
                        href={route("allocations.index")}
                        active={route().current("allocations.index")}
                    >
                        <div className="flex gap-2">
                            <Handshake size={20} />
                            Allocation
                        </div>
                    </NavLink>
                </li>
                {isAllocationOpen && (
                    <ul
                        className={`relative left-[1rem] transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                            isAllocationOpen
                                ? "max-h-40 opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                        onMouseEnter={() => setIsAllocationOpen(true)}
                        onMouseLeave={() => setIsAllocationOpen(false)}
                    >
                        <li className="border-l-2">
                            <NavLink
                                href={route("allocation.type.index")}
                                active={route().current(
                                    "allocation.type.index"
                                )}
                                className="border-l-[1px] "
                            >
                                <div className="flex gap-2">
                                    <HandCoins size={20} />
                                    Type
                                </div>
                            </NavLink>
                        </li>
                        <li className="border-l-2">
                            <NavLink
                                href={route("allocation.type.index")}
                                active={route().current(
                                    "allocation.type.index"
                                )}
                                className="border-l-[1px] "
                            >
                                <div className="flex gap-2">
                                    <NotebookTextIcon size={19} />
                                    List
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                )}
                <li
                    className="text-m"
                    onMouseEnter={() => setIsAllocationOpen(true)}
                    onMouseLeave={() => setIsAllocationOpen(false)}
                >
                    <NavLink
                        href={route("crop.damages.index")}
                        active={route().current("crop.damages.index")}
                    >
                        <div className="flex gap-2">
                            <BugIcon size={20} />
                            Crop Damages
                        </div>
                    </NavLink>
                </li>
                <li className="text-m">
                    <NavLink
                        href={route("crop.activity.index")}
                        active={route().current("crop.activity.index")}
                    >
                        <div className="flex gap-2">
                            <Tractor size={20} />
                            Crop Activity
                        </div>
                    </NavLink>
                </li>
                <br />
                <span className="ml-2 mb-4 text-sm text-slate-400">
                    Reports
                </span>
                <li
                    className="text-m"
                    onMouseEnter={() => setIsRecommendationOpen(true)}
                    onMouseLeave={() => setIsRecommendationOpen(false)}
                    onClick={handleRecommendationToggle}
                >
                    <NavLink
                        href={route("recommendations.index")}
                        active={route().current("recommendations.index")}
                    >
                        <div className="flex gap-2">
                            <Brain size={20} />
                            Recommendation
                        </div>
                    </NavLink>
                </li>
                {isRecommendationOpen && (
                    <ul
                        className={`relative left-[1rem] transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                            isRecommendationOpen
                                ? "max-h-40 opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                        onMouseEnter={() => setIsRecommendationOpen(true)}
                        onMouseLeave={() => setIsRecommendationOpen(false)}
                    >
                        <li className="border-l-2">
                            <NavLink
                                href={route("allocation.type.index")}
                                active={route().current(
                                    "allocation.type.index"
                                )}
                                className="border-l-[1px] "
                            >
                                <div className="flex gap-2">
                                    <Tally5Icon size={20} />
                                    Score
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                )}
                <li className="text-m">
                    <NavLink
                        href={route("geospatial.index")}
                        active={route().current("geospatial.index")}
                    >
                        <div className="flex gap-2">
                            <Earth size={20} />
                            Resource
                        </div>
                    </NavLink>
                </li>
                <br />
                {/* <span className="ml-2 mb-4 text-sm text-slate-400">
                    Settings
                </span>
                <li className="text-m">
                    <NavLink
                        href={route("settings.index")}
                        active={route().current("settings.index")}
                    >
                        <div className="flex gap-2">
                            <Wrench size={20} />
                            Settings
                        </div>
                    </NavLink>
                </li> */}
            </ul>
        </div>
    );
}
