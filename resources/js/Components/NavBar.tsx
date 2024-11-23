import { useState, PropsWithChildren, ReactNode } from "react";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, router } from "@inertiajs/react";
import { Brain, Earth, LogOut, Search, User2Icon } from "lucide-react";

type Props = {
    user: {
        pfp: string;
        firstname: string;
        lastname: string;
        email: string;
    };
};

export default function NavBar({ user }: Props) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [search, setSearch] = useState("");
    return (
        <nav className="fixed z-20 ml-4 border-b border-gray-100">
            <div className="bg-white rounded-[1rem] w-[1320px] shadow-sm mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link href="/dashboard">
                                <h1 className="text-xl font-bolder">
                                    Agroprofiler
                                </h1>
                            </Link>
                        </div>
                    </div>

                    <div className="content-center">
                        <input
                            type="search"
                            placeholder="search"
                            className="p-4 py-2 w-500 h-10 rounded-[0.9rem] border-slate-300 outline-none focus:border-green-800 shadow-sm"
                        />
                    </div>

                    <div className="grid grid-flow-col cols-2 content-center">
                        <div className="border border-slate-300 shadown-sm rounded-[0.9rem] p-2 hover:bg-slate-100 mr-2">
                            <Link href="/geospatial">
                                <Earth className="text-slate-700 hover:text-black" />
                            </Link>
                        </div>

                        <div className="border border-slate-300 shadown-sm rounded-[0.9rem] p-2 hover:bg-slate-100">
                            <Link href="/recommendations">
                                <Brain className="text-slate-700 hover:text-black" />
                            </Link>
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ms-6">
                        <div className="ms-3 relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            <span className="mx-1">
                                                {user.firstname}
                                            </span>
                                            <span>{user.lastname}</span>

                                            <svg
                                                className="ms-2 -me-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link
                                        href={route("profile.edit")}
                                        className="rounded-t-[2rem] "
                                    >
                                        <div className="flex gap-2">
                                            <User2Icon size={20} />
                                            Profile
                                        </div>
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="rounded-b-[2rem]"
                                    >
                                        <div className="flex gap-2">
                                            <LogOut size={20} />
                                            Log Out
                                        </div>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="-me-2 flex items-center sm:hidden">
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    (previousState) => !previousState
                                )
                            }
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? "inline-flex"
                                            : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? "inline-flex"
                                            : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={
                    (showingNavigationDropdown ? "block" : "hidden") +
                    " sm:hidden"
                }
            >
                <div className="pt-2 pb-3 space-y-1">
                    <ResponsiveNavLink
                        href={route("dashboard")}
                        active={route().current("dashboard")}
                    >
                        Dashboard
                    </ResponsiveNavLink>
                </div>

                <div className="pt-4 pb-1 border-t border-gray-200">
                    <div className="px-4">
                        <div className="font-medium text-base text-gray-800">
                            {user.firstname}
                        </div>
                        <div className="font-medium text-sm text-gray-500">
                            {user.email}
                        </div>
                    </div>

                    <div className="mt-3 space-y-1">
                        <ResponsiveNavLink href={route("profile.edit")}>
                            Profile
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            method="post"
                            href={route("logout")}
                            as="button"
                        >
                            Log Out
                        </ResponsiveNavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}
