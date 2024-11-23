import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Map as LeafletMap, GeoJSON as LeafletGeoJSON } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../css/ThematicMap.css";
import Modal from "./Modal";
import axios from "axios";

interface HeatmapProps {
    geoData: any;
    distributionData: {
        [barangay: string]: {
            allocations?: { [subtype: string]: number };
            commodities?: { [subtype: string]: number };
            farmers?: { [subtype: string]: number };
            highValue?: { [subtype: string]: number };
        };
    };
}

const distributions = {
    allocations: ["All", "Cash Assistance", "Pesticide", "Fertilizer"],
    commodities: ["All", "Rice", "Corn", "Fish"],
    farmers: ["All", "Registered", "Unregistered"],
    highValue: ["All", "Fruit-Bearing", "Vegetables"],
};

const Heatmap: React.FC<HeatmapProps> = ({ distributionData }) => {
    const [geoData, setGeoData] = useState<any>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedBarangay, setSelectedBarangay] = useState<any>(null);
    const [view, setView] = useState<
        "allocations" | "commodities" | "farmers" | "highValue"
    >("allocations");
    const [subtype, setSubtype] = useState<string>("All");
    const geoJsonLayer = useRef<any>(null);

    const openModal = (barangay: any): void => {
        const barangayKey = barangay.name.replace(/\s+/g, "");
        const data =
            subtype === "All"
                ? calculateTotalForAll(barangayKey)
                : {
                      [view]:
                          distributionData[barangayKey]?.[view]?.[subtype] || 0,
                  };

        const intensityCategory = getIntensityCategory(barangay.intensity);

        setSelectedBarangay({
            name: barangay.name,
            intensity: barangay.intensity,
            intensityCategory,
            data: data,
        });
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        setSelectedBarangay(null);
    };

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const response = await axios.get("/Digos_City.geojson");
                setGeoData(response.data);

                if (mapRef.current && response.data) {
                    geoJsonLayer.current = new LeafletGeoJSON(response.data);
                    const bounds = geoJsonLayer.current.getBounds();
                    mapRef.current.fitBounds(bounds);
                    mapRef.current.setMaxBounds(bounds);
                }
            } catch (error) {
                console.error("Error fetching GeoJSON data:", error);
            }
        };

        fetchGeoData();
    }, []);

    const getColor = (intensity: number) => {
        return intensity > 100
            ? "#4d7c0f"
            : intensity > 70
            ? "#65a30d"
            : intensity > 50
            ? "#84cc16"
            : intensity > 20
            ? "#bef264"
            : "#d9f99d";
    };

    const getIntensityCategory = (intensity: number) => {
        return intensity > 100
            ? "Very High"
            : intensity > 70
            ? "High"
            : intensity > 50
            ? "Medium"
            : intensity > 20
            ? "Low"
            : "Very Low";
    };

    const onEachFeature = (feature: any, layer: any) => {
        const barangayName = feature.properties.NAME_2;

        let value = 0;

        if (subtype === "All") {
            value = calculateTotalForAll(barangayName)[view] || 0;
        } else {
            value = distributionData[barangayName]?.[view]?.[subtype] || 0;
        }

        const intensityCategory = getIntensityCategory(value);

        layer.bindTooltip(`${barangayName} - ${intensityCategory}: ${value}`, {
            permanent: false,
            direction: "left",
            className: "barangay-tooltip",
        });

        layer.on({
            click: () => {
                openModal({
                    name: feature.properties.NAME_2,
                    intensity: layer.options.fillColor,
                });
            },
        });
    };

    const style = (feature: any) => {
        const barangayName = feature.properties.NAME_2.replace(/\s+/g, "");
        let intensity = 0;
        if (subtype === "All") {
            intensity = calculateTotalForAll(barangayName)[view] || 0;
        } else {
            intensity = distributionData[barangayName]?.[view]?.[subtype] || 0;
        }

        // console.log(
        //     `Barangay: ${barangayName}, Data Path:`,
        //     distributionData[barangayName]
        // );

        return {
            fillColor: getColor(intensity),
            weight: 2,
            opacity: 1,
            color: "black",
            dashArray: "3",
            fillOpacity: 0.9,
        };
    };

    const handleChangeView = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as
            | "allocations"
            | "commodities"
            | "farmers"
            | "highValue";
        setView(value);
        setSubtype("All");
    };

    const handleChangeSubtype = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSubtype(event.target.value);
    };

    const calculateTotalForAll = (barangayName: string) => {
        const allocationTotal = Object.values(
            distributionData[barangayName]?.allocations || {}
        ).reduce((acc, val) => acc + val, 0);
        const commodityTotal = Object.values(
            distributionData[barangayName]?.commodities || {}
        ).reduce((acc, val) => acc + val, 0);
        const farmerTotal = Object.values(
            distributionData[barangayName]?.farmers || {}
        ).reduce((acc, val) => acc + val, 0);
        const highValueTotal = Object.values(
            distributionData[barangayName]?.highValue || {}
        ).reduce((acc, val) => acc + val, 0);

        return {
            allocations: allocationTotal,
            commodities: commodityTotal,
            farmers: farmerTotal,
            highValue: highValueTotal,
        };
    };

    const renderLegend = () => (
        <div className="legend-container">
            <div className="legend">
                <h4>
                    {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
                    {subtype && subtype !== "All" ? `- ${subtype}` : ""}
                </h4>
                <ul>
                    <li className="legend-item" style={{ color: "#bef264" }}>
                        <span
                            className="legend-icon"
                            style={{ backgroundColor: "#bef264" }}
                        ></span>{" "}
                        Very Low (0-20)
                    </li>
                    <li className="legend-item" style={{ color: "#84cc16" }}>
                        <span
                            className="legend-icon"
                            style={{ backgroundColor: "#84cc16" }}
                        ></span>{" "}
                        Low (21-50)
                    </li>
                    <li className="legend-item" style={{ color: "#65a30d" }}>
                        <span
                            className="legend-icon"
                            style={{ backgroundColor: "#65a30d" }}
                        ></span>{" "}
                        Medium (51-70)
                    </li>
                    <li className="legend-item" style={{ color: "#65a30d" }}>
                        <span
                            className="legend-icon"
                            style={{ backgroundColor: "#65a30d" }}
                        ></span>{" "}
                        High (71-100)
                    </li>
                    <li className="legend-item" style={{ color: "#4d7c0f" }}>
                        <span
                            className="legend-icon"
                            style={{ backgroundColor: "#4d7c0f" }}
                        ></span>{" "}
                        Very High (100+)
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <div className="heatmap-container">
            <MapContainer
                center={[6.75, 125.35]}
                zoom={13}
                scrollWheelZoom={false}
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "500px",
                    zIndex: "20",
                    borderRadius: "1.5rem",
                    backgroundColor: "#e2e8f0",
                }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoData && (
                    <GeoJSON
                        key={view + subtype}
                        data={geoData}
                        style={style}
                        onEachFeature={onEachFeature}
                    />
                )}
                {renderLegend()}
            </MapContainer>
            <div className="select-container">
                <select
                    id="view-select"
                    onChange={handleChangeView}
                    value={view}
                >
                    <option value="allocations">Allocations</option>
                    <option value="commodities">Commodities</option>
                    <option value="farmers">Farmers</option>
                    <option value="highValue">High-Value Crops</option>
                </select>

                <select
                    id="subtype-select"
                    onChange={handleChangeSubtype}
                    value={subtype}
                >
                    {distributions[view].map((dist) => (
                        <option key={dist} value={dist}>
                            {dist}
                        </option>
                    ))}
                </select>
            </div>
            <Modal show={isModalOpen} onClose={closeModal}>
                <h2>{selectedBarangay?.name}</h2>
                <p>Intensity Category: {selectedBarangay?.intensityCategory}</p>
                <div>
                    {selectedBarangay &&
                        Object.entries(selectedBarangay.data).map(
                            ([type, count]) => (
                                <p key={type}>
                                    {type}: {String(count)}
                                </p>
                            )
                        )}
                </div>
            </Modal>
        </div>
    );
};

export default Heatmap;
