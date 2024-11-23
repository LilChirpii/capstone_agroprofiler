import Card from "@/Components/Card";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import L from "leaflet";
import {
    Accessibility,
    Briefcase,
    Building,
    Cake,
    HouseIcon,
    School,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";

const redMarker = new L.Icon({
    iconUrl: "/icons/fish.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Farm {
    id: number;
    commodity: {
        name: string;
    };
    ha: number;
    owner: string;
    latitude: number;
    longitude: number;
}

interface Barangay {
    id: number;
    name: string;
}

interface Allocation {
    allocation_type: string;
    date_received: string;
}

interface CropDamage {
    cause: string;
    total_damaged_area: number;
}

interface Farmer {
    id: number;
    firstname: string;
    lastname: string;
    age: number;
    sex: string;
    status: string;
    coop: string;
    pwd: string;
    barangay: {
        id: number;
        name: string;
    };
    "4ps"?: string;
    dob: string;
    allocations: Allocation[];
    crop_damages: CropDamage[];
    farms: Farm[];
}

interface FarmersListProps extends PageProps {
    farmer: Farmer;
    farms: Farm[];
    allocations: Allocation[];
    crop_damages: CropDamage[];
}

export default function FarmProfile({ auth, farmer }: FarmersListProps) {
    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl mt-2 text-gray-800 leading-tight">
                    Farmer's Profile
                </h2>
            }
        >
            <Head title="Farmer Profile" />
            <div className="grid grid-rows-1 gap-2">
                <div className="grid grid-flow-col grid-cols-2 gap-2 p-5 rounded-[1rem] shadow-sm">
                    <div className="col-span-1 grid grid-flow-col grid-cols-3 gap-1 border-r-1">
                        <div className="relative w-[140px] h-[130px] ">
                            <img
                                src="/icons/default.jpg"
                                alt="id"
                                className="absolute w-[100%] h-[100%] object-cover border border-slate-100 rounded-3xl"
                            />
                        </div>
                        <div className="col-span-2 grid grid-flow-row grid-rows-3">
                            <div>
                                <span className="text-lg text-slate-700">
                                    {farmer.firstname} {farmer.lastname}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] bg-green-800 text-white rounded-[2rem] px-2 py-1">
                                    {farmer.status}
                                </span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Cake size={20} />
                                <span className="inline mt-1 text-sm text-slate-700">
                                    {new Date(farmer.dob).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <HouseIcon size={20} />
                                <span className="text-sm mt-1 flex-wrap w-[250px] text-slate-700">
                                    {farmer.barangay.name}, Davao del Sur
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-rows-3 gap-2">
                            <div className="flex gap-2">
                                <Briefcase size={20} />
                                <span className="inline mt-1 text-sm text-slate-700">
                                    Farmer
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Building size={20} />
                                <span className="inline mt-1 text-sm text-slate-700">
                                    {farmer.coop}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Accessibility size={22} />
                                <span className="inline mt-1 text-sm text-slate-700">
                                    {farmer.pwd === "yes" ? "PWD" : "Not PWD"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-flow-col grid-cols-2 gap-2 ">
                    <div>
                        <Card title="List of Allocations Received">
                            <table className="table-fixed">
                                <thead>
                                    <tr>
                                        <th>Allocation</th>
                                        <th>Date Received</th>
                                    </tr>
                                </thead>
                                {Array.isArray(farmer.allocations) &&
                                farmer.allocations.length > 0 ? (
                                    farmer.allocations.map(
                                        (
                                            allocation: Allocation,
                                            index: number
                                        ) => (
                                            <>
                                                <td key={index}>
                                                    {allocation.allocation_type}
                                                </td>
                                                <td>
                                                    {new Date(
                                                        allocation.date_received
                                                    ).toLocaleDateString()}
                                                </td>
                                            </>
                                        )
                                    )
                                ) : (
                                    <li>No allocations received</li>
                                )}
                            </table>
                        </Card>
                    </div>

                    <div>
                        <Card title="List of Times Affected by Damage">
                            <div className="overflow-auto">
                                <ul>
                                    {Array.isArray(farmer.crop_damages) &&
                                    farmer.crop_damages.length > 0 ? (
                                        farmer.crop_damages.map(
                                            (
                                                damage: CropDamage,
                                                index: number
                                            ) => (
                                                <li key={index}>
                                                    cause: {damage.cause}
                                                    <br />
                                                    Total damaged area:
                                                    {damage.total_damaged_area}
                                                </li>
                                            )
                                        )
                                    ) : (
                                        <li>No damages recorded</li>
                                    )}
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="grid grid-flow-col grid-cols-2 gap-2">
                    <div>
                        <Card title="List of Farms">
                            <ul>
                                {farmer.farms.map((farm, index) => (
                                    <li key={index}>
                                        commodity name: {farm.commodity?.name}
                                        <br />
                                        hectares: {farm.ha}
                                        <br />
                                        owner? {farm.owner}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                    <div>
                        <Card title="Locations of Farms Registered">
                            <MapContainer
                                center={[
                                    farmer.farms[0]?.latitude || 0,
                                    farmer.farms[0]?.longitude || 0,
                                ]}
                                zoom={13}
                                style={{
                                    height: "400px",
                                    width: "100%",
                                    borderRadius: "20px",
                                }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Map tiles from OpenStreetMap
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {farmer.farms.map((farm, index) => (
                                    <Marker
                                        key={index}
                                        position={[
                                            farm.latitude,
                                            farm.longitude,
                                        ]}
                                        icon={redMarker}
                                    >
                                        <Popup>
                                            <span>
                                                Commodity:{" "}
                                                {farm.commodity?.name}
                                                <br />
                                                Hectares: {farm.ha}
                                                <br />
                                                Owner: {farm.owner}
                                            </span>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </Card>
                    </div>
                </div>
                <div>
                    <Card title="Other Relevant Information">See here</Card>
                </div>
            </div>
        </Authenticated>
    );
}
