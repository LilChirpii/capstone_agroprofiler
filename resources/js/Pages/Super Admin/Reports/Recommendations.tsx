import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
    Box,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface AllocationType {
    id: string;
    name: string;
}

interface Recommendation {
    id: string;
    farmerName: string;
    commodity: string;
    allocationType: string;
    cropDamageCause: string;
    reasons: string[];
    score: number;
}

interface FarmerDetails {
    id: string;
    name: string;
    age: number;
    barangay: string;
    eligibilityStatus: string;
    commodities: string[];
    recentAllocations: string[];
}

interface RecommendationProps extends PageProps {
    allocationDetails: Array<{
        allocation_type: string;
        commodities: string[];
        elligibilities: string[];
        barangays: string[];
        crop_damage_causes: string[];
    }>;
}

const Recommendation: React.FC<RecommendationProps> = ({
    auth,
    allocationDetails,
}) => {
    const [allocationTypes, setAllocationTypes] = useState<AllocationType[]>(
        []
    );
    const [selectedAllocationTypeId, setSelectedAllocationTypeId] =
        useState("");
    const [recommendations, setRecommendations] = useState<Recommendation[]>(
        []
    );
    const [loading, setLoading] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState<FarmerDetails | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchAllocationTypes = async () => {
            try {
                const response = await axios.get("/allocation-types");
                setAllocationTypes(response.data);
            } catch (error) {
                console.error("Error fetching allocation types:", error);
            }
        };
        fetchAllocationTypes();
    }, []);

    const handleAllocationChange = (event: SelectChangeEvent<string>) => {
        setSelectedAllocationTypeId(event.target.value as string);
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            if (!selectedAllocationTypeId) {
                console.error("No allocation type selected");
                return;
            }

            const response = await axios.post("/recommend-allocations", {
                allocation_type_id: selectedAllocationTypeId,
            });
            setRecommendations(response.data.farmers || []);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = async (params: any) => {
        const farmerId = params.row.id;
        try {
            const response = await axios.get(`/farmers/${farmerId}`);
            setSelectedFarmer(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching farmer details:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFarmer(null);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "rsbsaRefNo", headerName: "RSBSBA REF NO", width: 150 },
        { field: "score", headerName: "Score", width: 80 },
        { field: "farmerName", headerName: "Farmer Name", width: 150 },
        { field: "commodity", headerName: "Commodity", width: 150 },
        { field: "allocationType", headerName: "Allocation Type", width: 200 },

        {
            field: "reasons",
            headerName: "Reasons",
            flex: 1,
            renderCell: (params: any) =>
                params.value ? (
                    <div className="flex flex-wrap">
                        {params.value.map((reason, index) => (
                            <React.Fragment key={index}>
                                {reason}
                                {index < params.value.length - 1}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div>No reasons available</div>
                ),
        },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Box sx={{ flexGrow: 1 }} />
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                    Generate Allocation Recommendations
                </h2>
            }
        >
            <Head title="Recommendation Generation" />

            <Box sx={{ p: 3 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select Allocation Type</InputLabel>
                    <Select
                        value={selectedAllocationTypeId}
                        onChange={handleAllocationChange}
                    >
                        {allocationTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="success"
                    onClick={fetchRecommendations}
                    disabled={!selectedAllocationTypeId}
                    sx={{ mt: 2 }}
                >
                    Get Recommendations
                </Button>

                <Box
                    sx={{
                        height: 400,
                        width: "100%",
                        mt: 3,
                        borderRadius: "2rem",
                    }}
                >
                    <DataGrid
                        rows={recommendations}
                        columns={columns}
                        loading={loading}
                        pageSize={10}
                        onRowClick={handleRowClick}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    />
                </Box>

                <Dialog open={isModalOpen} onClose={closeModal}>
                    <DialogTitle>Farmer Details</DialogTitle>
                    <DialogContent>
                        {selectedFarmer ? (
                            <>
                                <Typography variant="body1">
                                    Name: {selectedFarmer.name}
                                </Typography>
                                <Typography variant="body1">
                                    Age: {selectedFarmer.age}
                                </Typography>
                                <Typography variant="body1">
                                    Barangay: {selectedFarmer.barangay}
                                </Typography>
                                <Typography variant="body1">
                                    Eligibility Status:{" "}
                                    {selectedFarmer.eligibilityStatus}
                                </Typography>
                                <Typography variant="body1">
                                    Commodities:{" "}
                                    {selectedFarmer.commodities.join(", ")}
                                </Typography>
                                <Typography variant="body1">
                                    Recent Allocations:{" "}
                                    {selectedFarmer.recentAllocations.join(
                                        ", "
                                    )}
                                </Typography>
                            </>
                        ) : (
                            <Typography>Loading...</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Authenticated>
    );
};

export default Recommendation;
