import ApplicationLogo from "@/Components/ApplicationLogo";
import Card from "@/Components/Card";
import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
// import { Logo } from "@/Pages/Super Admin/logo.jpg";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <Card title="" className=" max-w-[30rem]">
                <div className="flex content-center justify-center p-4 border-b-[1px] border-slate-300">
                    <ApplicationLogo />
                </div>

                <br />

                {children}
            </Card>
        </div>
    );
}
