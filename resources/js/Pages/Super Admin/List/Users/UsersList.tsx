import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import axios from "axios";
import { Button, TextField, Box } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { PageProps } from "@/types";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    section: string;
    sex: string;
    status: string;
    pfp: string;
}

interface UserListProps extends PageProps {
    users: User[];
}

const UsersList: React.FC<UserListProps> = () => {
    const [users, setUsers] = useState<GridRowsProp>([]); // Initialize as an empty array
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch data from the backend
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/users");
            console.log(response.data); // Log to check the API response
            setUsers(response.data.users || []); // Ensure users data is set correctly
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Handle user search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Edit user (replace with your edit functionality)
    const editUser = (id: string) => {
        console.log(`Editing user with ID: ${id}`);
        // Redirect to the edit page or open a modal
    };

    // Delete user
    const deleteUser = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`/users/destroy/${id}`);
                fetchUsers(); // Refresh the list after deletion
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 100 },
        {
            field: "firstname",
            headerName: "First Name",
            width: 200,
            sortable: true,
        },
        {
            field: "lastname",
            headerName: "Last Name",
            width: 200,
            sortable: true,
        },
        { field: "role", headerName: "Role", width: 150, sortable: true },
        { field: "status", headerName: "Status", width: 150, sortable: true },
        { field: "email", headerName: "Email", width: 250, sortable: true },
        {
            field: "actions",
            headerName: "Actions",
            renderCell: (params: any) => (
                <Box>
                    <Button onClick={() => editUser(params.row.id)}>
                        Edit
                    </Button>
                    <Button onClick={() => deleteUser(params.row.id)}>
                        Delete
                    </Button>
                </Box>
            ),
            width: 200,
        },
    ];

    // Export the data
    const handleExport = () => {
        const csvRows = [
            columns.map((col) => col.headerName).join(","), // header
            ...users.map((user) =>
                columns
                    .map((col) => user[col.field as keyof typeof user])
                    .join(",")
            ),
        ];
        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "users.csv";
        link.click();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = (users || []).filter((user) =>
        `${user.firstname} ${user.lastname}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    console.log(users);
    return (
        <div style={{ height: 600, width: "100%" }}>
            <Box mb={2}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                    fullWidth
                />
            </Box>
            <Button
                onClick={handleExport}
                variant="contained"
                color="primary"
                style={{ marginBottom: "10px" }}
            >
                Export CSV
            </Button>
            <DataGrid
                rows={filteredUsers}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                loading={loading}
                components={{ Toolbar: GridToolbar }}
            />
        </div>
    );
};

export default UsersList;
