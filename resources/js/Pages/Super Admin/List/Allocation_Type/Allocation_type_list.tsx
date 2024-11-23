import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function allocation_type_list({ auth }: PageProps) {
    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                    Allocation Type Management
                </h2>
            }
        >
            <Head title="Commodity Management" />
            <ToastContainer />
        </Authenticated>
    );
}
