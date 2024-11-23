import {
    ChevronDown,
    ChevronUp,
    Edit2Icon,
    Ellipsis,
    EllipsisIcon,
    EllipsisVertical,
    Eye,
    MoreHorizontal,
    Trash,
} from "lucide-react";
import React, { useState } from "react";
import Checkbox from "./Checkbox";

interface ListProps {
    rows: { [key: string]: any }[];
    columns: string[];
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
    onView: (row: any) => void;
}

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function List({
    rows,
    columns,
    onEdit,
    onDelete,
    onView,
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}: ListProps & PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxVisiblePages = 5;

    const [isSelected, setIsSelected] = useState(false);

    const getVisiblePages = () => {
        const pages = [];

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(
                1,
                currentPage - Math.floor(maxVisiblePages / 2)
            );
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (startPage > 1) {
                pages.unshift("...");
                pages.unshift(1);
            }

            if (endPage < totalPages) {
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "ascending" | "descending" | null;
    }>({
        key: "",
        direction: null,
    });

    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const sortedRows = [...rows].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
        }
        return 0;
    });

    const handleSort = (column: string) => {
        let direction: "ascending" | "descending" | null = "ascending";
        if (sortConfig.key === column && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key: column, direction });
    };

    const toggleDropdown = (index: number) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <div className="relative p-2 w-[100%] h-[23rem] ">
            <table className="fixed overflow-auto border-collapse h-[200px] w-[100%]">
                <tr className="fixed top-45 z-1000 w-[100%]  h-[80px]">
                    <div className="flex text-left gap-10 fixed border py-2 rounded-[0.8rem] w-[78%] bg-slate-200 p-1">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="text-sm text-left w-[100px] cursor-pointer"
                                onClick={() => handleSort(column)}
                            >
                                {column}
                                {sortConfig.key === column && (
                                    <span className="flex items-center absolute ">
                                        {sortConfig.direction ===
                                        "ascending" ? (
                                            <ChevronUp
                                                size={18}
                                                className="text-green-500"
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={18}
                                                className="text-green-200"
                                            />
                                        )}
                                    </span>
                                )}
                            </th>
                        ))}
                        <th className="text-sm col-span-3">Actions</th>
                    </div>
                </tr>

                <div className="relative top-[58px] overflow-auto w-[79%] h-[250px]">
                    {sortedRows.map((row, rowIndex) => (
                        <div className="relative w-[100%]">
                            <tr
                                className="flex text-left gap-10 mr-5 p-1 mb-1 hover:bg-slate-100 cursor-pointer rounded-[0.8rem] w-[100%]"
                                key={rowIndex}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        className="text-sm text-left w-[80px] whitespace-nowrap text-ellipsis overflow-hidden"
                                        key={colIndex}
                                    >
                                        {row[column]}
                                    </td>
                                ))}
                                <td className="text-sm w-[70px] ">
                                    <EllipsisVertical
                                        onClick={() => toggleDropdown(rowIndex)}
                                        className="cursor-pointer"
                                    />
                                    {openDropdown === rowIndex && (
                                        <div className="absolute z-1000 right-20 top-1 bg-white border rounded-xl shadow-lg">
                                            <ul className="list-none m-0 p-2">
                                                <li
                                                    className="cursor-pointer text-blue-400 flex gap-1 hover:bg-gray-200 rounded-xl p-3 py-2 z-auto"
                                                    onClick={() => {
                                                        onView(row);
                                                        setOpenDropdown(null);
                                                    }}
                                                >
                                                    <Eye size={19} />
                                                    View
                                                </li>
                                                <li
                                                    className="cursor-pointer text-green-400 flex gap-1  hover:bg-gray-200 rounded-xl p-3 py-2"
                                                    onClick={() => {
                                                        onEdit(row);
                                                        setOpenDropdown(null);
                                                    }}
                                                >
                                                    <Edit2Icon size={18} />
                                                    Edit
                                                </li>
                                                <li
                                                    className="cursor-pointer flex gap-1 text-red-400 hover:bg-gray-200 rounded-xl p-3 py-2"
                                                    onClick={() => {
                                                        onDelete(row);
                                                        setOpenDropdown(null);
                                                    }}
                                                >
                                                    <Trash size={18} />
                                                    Delete
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        </div>
                    ))}
                </div>
            </table>

            <div className="fixed rounded-xl p-2 l-[15rem] bg-slate-200 z-100 bottom-5 right-[15rem] w-[50%] flex items-center justify-center mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-1 mx-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>

                {visiblePages.map((page, index) => (
                    <button
                        key={index}
                        onClick={() =>
                            typeof page === "number" && onPageChange(page)
                        }
                        disabled={page === currentPage || page === "..."}
                        className={`px-3 py-1 mx-1 text-sm rounded ${
                            page === currentPage
                                ? "bg-green-500 text-white"
                                : page === "..."
                                ? "text-gray-500"
                                : "bg-gray-200"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-1 mx-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
