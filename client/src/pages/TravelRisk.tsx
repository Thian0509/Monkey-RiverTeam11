// client/src/pages/TravelRisk.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toolbar } from 'primereact/toolbar';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Slider } from 'primereact/slider'; // For riskLevel number input
import { InputNumber } from 'primereact/inputnumber'; // For explicit number input for riskLevel

import axios from 'axios';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotification';

// Import your custom.geo.json (assuming it's in public/data)
// If you put it in src/, you might need a different import method depending on your bundler (e.g., Vite/Webpack)
// For simplicity, we'll fetch it as a static asset.
// const geoJsonData = require('../../public/data/custom.geo.json'); // Example if using CommonJS and located differently
// Or, if your bundler supports direct JSON import for files in src/:
// import geoJsonData from '../data/custom.geo.json';

// Define the type for a Feature in your GeoJSON
interface GeoJsonFeature {
    type: "Feature";
    properties: {
        name: string;
        // Add other properties you might care about from custom.geo.json
        // For example, if you want to store country codes etc.
        iso_a2?: string;
        name_long?: string;
    };
    geometry: any; // Can be more specific if needed
}

// Define the type for a Monitored Destination
interface Destination {
    _id?: string;
    location: string;
    riskLevel: number; // Now a number from 1 to 100
    lastChecked: string;
}

const TravelRisk: React.FC = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [newDestination, setNewDestination] = useState<Destination>({
        location: '',
        riskLevel: 50, // Default to 50 (middle of 1-100)
        lastChecked: new Date().toISOString().split('T')[0]
    });
    const [submitted, setSubmitted] = useState<boolean>(false);

    const [locationOptions, setLocationOptions] = useState<{ label: string; value: string }[]>([]); // For location dropdown
    const toast = useRef<Toast>(null);
    const { token } = useAuth();
    const { addNotification } = useNotifications();

    const API_BASE_URL = 'http://localhost:5050/api/destinations';

    // --- Data Loading (GeoJSON) ---
    useEffect(() => {
        const loadGeoJsonData = async () => {
            try {
                // Fetch from public folder. Adjust path if your custom.geo.json is elsewhere.
                const response = await fetch('/custom.geo.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const options = data.features.map((feature: GeoJsonFeature) => ({
                    label: feature.properties.name_long || feature.properties.name, // Use long name if available, else short
                    value: feature.properties.name_long || feature.properties.name,
                }));
                setLocationOptions(options);
            } catch (error) {
                console.error("Failed to load custom.geo.json:", error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load location data for dropdown.',
                    life: 5000
                });
            }
        };

        loadGeoJsonData();
    }, []); // Run once on component mount

    // --- API CALLS (Unchanged from previous version for core logic, just riskLevel type) ---

    const fetchDestinations = async () => {
        setLoading(true);
        setGlobalError(null);
        try {
            if (!token) {
                setGlobalError('Not authenticated. Please log in.');
                setLoading(false);
                return;
            }
            const response = await axios.get<Destination[]>(API_BASE_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDestinations(response.data);
        } catch (err: any) {
            console.error("Error fetching destinations:", err);
            const errorMessage = err.response?.data?.message || 'Failed to fetch destinations';
            setGlobalError(errorMessage);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const addDestination = async () => {
        setSubmitted(true);
        if (!newDestination.location || !newDestination.riskLevel || newDestination.riskLevel < 1 || newDestination.riskLevel > 100) {
            return;
        }

        try {
            if (!token) throw new Error('Not authenticated.');
            const response = await axios.post<Destination>(API_BASE_URL, newDestination, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDestinations(prev => [...prev, response.data]);
            addNotification(`Successfully added destination.`);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Destination Added', life: 3000 }); 
            hideDialog();
        } catch (err: any) {
            console.error("Error adding destination:", err);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: err.response?.data?.message || 'Failed to add destination',
                life: 5000
            });
        }
    };

    const updateDestination = async (destinationToUpdate: Destination) => {
        if (!destinationToUpdate._id || !destinationToUpdate.location || destinationToUpdate.riskLevel === undefined || destinationToUpdate.riskLevel < 1 || destinationToUpdate.riskLevel > 100) {
            toast.current?.show({ severity: 'error', summary: 'Validation Error', detail: 'Location and Risk Level (1-100) cannot be empty/invalid.', life: 3000 });
            return;
        }

        try {
            if (!token) throw new Error('Not authenticated.');
            const response = await axios.put<Destination>(`${API_BASE_URL}/${destinationToUpdate._id}`, destinationToUpdate, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDestinations(prev =>
                prev.map(dest => (dest._id === destinationToUpdate._id ? response.data : dest))
            );
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Destination Updated', life: 3000 });
            hideDialog();
        } catch (err: any) {
            console.error("Error updating destination:", err);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: err.response?.data?.message || 'Failed to update destination',
                life: 5000
            });
        }
    };

    const deleteDestination = async (_id: string) => {
        confirmDialog({
            message: 'Are you sure you want to delete this destination?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    if (!token) throw new Error('Not authenticated.');
                    await axios.delete(`${API_BASE_URL}/${_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setDestinations(prev => prev.filter(dest => dest._id !== _id));
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Destination Deleted', life: 3000 });
                } catch (err: any) {
                    console.error("Error deleting destination:", err);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.response?.data?.message || 'Failed to delete destination',
                        life: 5000
                    });
                }
            },
            reject: () => {}
        });
    };

    useEffect(() => {
        if (token) {
            fetchDestinations();
        } else {
            setLoading(false);
            setGlobalError('Please log in to view and manage destinations.');
            setDestinations([]);
        }
    }, [token]);

    // --- UI Logic and Primereact Specifics ---

    const openNew = () => {
        setNewDestination({
            location: '',
            riskLevel: 50,
            lastChecked: new Date().toISOString().split('T')[0]
        });
        setSelectedDestination(null);
        setSubmitted(false);
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
        setSelectedDestination(null);
        setSubmitted(false);
        setNewDestination({
            location: '',
            riskLevel: 50,
            lastChecked: new Date().toISOString().split('T')[0]
        });
    };

    const saveDestination = () => {
        if (selectedDestination) {
            updateDestination(selectedDestination);
        } else {
            addDestination();
        }
    };

    const editDestination = (destination: Destination) => {
        setSelectedDestination({ ...destination });
        setSubmitted(false);
        setDisplayDialog(true);
    };

    // Primereact DataTable columns and editors
    const riskLevelEditor = (options: any) => {
        return (
            <div className="p-fluid">
                <InputNumber
                    value={options.value}
                    onValueChange={(e) => options.editorCallback(e.value || 0)}
                    min={1} max={100}
                    mode="decimal"
                    showButtons
                    autoFocus
                />
                <Slider
                    value={options.value}
                    onChange={(e) => options.editorCallback(Array.isArray(e.value) ? e.value[0] : e.value || 0)}
                    min={1} max={100}
                    className="mt-2"
                />
            </div>
        );
    };

    const dateEditor = (options: any) => {
        return (
            <Calendar
                value={options.value ? new Date(options.value) : null}
                onChange={(e) => options.editorCallback(e.value ? e.value.toISOString().split('T')[0] : '')}
                dateFormat="yy-mm-dd"
                showIcon
            />
        );
    };

    const locationEditor = (options: any) => {
        return (
            <Dropdown
                value={options.value}
                options={locationOptions}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Location"
                filter // Enable filtering
                showClear // Allow clearing selection
                autoFocus
            />
        );
    };

    // Handle cell edit completion (for inline editing)
    const onCellEditComplete = (e: any) => {
        let { rowData, newValue, field } = e;

        if (newValue !== rowData[field]) {
            let updatedDestinations = [...destinations];
            let targetIndex = updatedDestinations.findIndex(d => d._id === rowData._id);

            if (targetIndex !== -1) {
                const tempUpdatedRow = { ...rowData, [field]: newValue };
                setDestinations(updatedDestinations.map((d, i) => (i === targetIndex ? tempUpdatedRow : d))); // Update state immediately
                updateDestination(tempUpdatedRow); // Send update to backend
            }
        }
    };

    const actionBodyTemplate = (rowData: Destination) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editDestination(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteDestination(rowData._id!)} />
            </React.Fragment>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New Destination" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveDestination} />
        </React.Fragment>
    );

    return (
        <div className="flex flex-col items-center p-4 w-screen h-screen bg-gray-100">
            <Toast ref={toast} />
            <ConfirmDialog />

            <h1 className="text-3xl font-bold mb-6 text-gray-800">Travel Risk Assessment</h1>

            <div className="card p-fluid w-full max-w-4xl shadow-lg rounded-lg bg-white">
                <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <ProgressSpinner />
                        <p className="ml-4 text-lg text-blue-600">Loading destinations...</p>
                    </div>
                ) : globalError ? (
                    <p className="text-center text-lg text-red-600 p-4">{globalError}</p>
                ) : (
                    <DataTable
                        value={destinations}
                        editMode="cell"
                        tableStyle={{ minWidth: '50rem' }}
                        emptyMessage="No destinations found."
                        className="p-datatable-gridlines"
                        dataKey="_id"
                    >
                        <Column
                            field="_id"
                            header="ID"
                            style={{ width: '15%' }}
                            body={(rowData: Destination) => rowData._id?.substring(0, 8)}
                        />
                        <Column
                            field="location"
                            header="Location"
                            style={{ width: '25%' }}
                            editor={locationEditor} // Use location dropdown editor
                            onCellEditComplete={onCellEditComplete}
                        />
                        <Column
                            field="riskLevel"
                            header="Risk Level (1-100)"
                            style={{ width: '20%' }}
                            editor={riskLevelEditor} // Use risk level slider/number editor
                            onCellEditComplete={onCellEditComplete}
                        />
                        <Column
                            field="lastChecked"
                            header="Last Checked"
                            style={{ width: '20%' }}
                            editor={dateEditor}
                            onCellEditComplete={onCellEditComplete}
                        />
                        <Column
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{ minWidth: '10rem', width: '20%' }}
                            header="Actions"
                        ></Column>
                    </DataTable>
                )}
            </div>

            {/* Add/Edit Destination Dialog */}
            <Dialog
                visible={displayDialog}
                style={{ width: '450px' }}
                header={selectedDestination ? "Edit Destination" : "New Destination"}
                modal
                className="p-fluid"
                footer={dialogFooter}
                onHide={hideDialog}
            >
                <div className="field mb-4">
                    <label htmlFor="location" className="font-bold">Location</label>
                    <Dropdown
                        id="location"
                        value={selectedDestination ? selectedDestination.location : newDestination.location}
                        options={locationOptions}
                        onChange={(e) => selectedDestination ? setSelectedDestination({ ...selectedDestination, location: e.value }) : setNewDestination({ ...newDestination, location: e.value })}
                        placeholder="Select a Location"
                        required
                        filter
                        showClear
                        className={submitted && (!selectedDestination && !newDestination.location) ? 'p-invalid' : ''}
                    />
                    {submitted && (!selectedDestination && !newDestination.location) && <small className="p-error">Location is required.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="riskLevel" className="font-bold">Risk Level (1-100)</label>
                    <InputNumber
                        id="riskLevel"
                        value={selectedDestination ? selectedDestination.riskLevel : newDestination.riskLevel}
                        onValueChange={(e) => {
                            const val = e.value !== null ? e.value : 1; // Default to 1 if null
                            if (selectedDestination) {
                                setSelectedDestination({ ...selectedDestination, riskLevel: val });
                            } else {
                                setNewDestination({ ...newDestination, riskLevel: val });
                            }
                        }}
                        min={1} max={100}
                        showButtons
                        className={submitted && (!selectedDestination && (newDestination.riskLevel < 1 || newDestination.riskLevel > 100)) ? 'p-invalid' : ''}
                    />
                     {submitted && (!selectedDestination && (newDestination.riskLevel < 1 || newDestination.riskLevel > 100)) && <small className="p-error">Risk Level must be between 1 and 100.</small>}
                    <Slider
                        value={selectedDestination ? selectedDestination.riskLevel : newDestination.riskLevel}
                        onChange={(e) => {
                            const val = Array.isArray(e.value) ? e.value[0] : e.value;
                            if (selectedDestination) {
                                setSelectedDestination({ ...selectedDestination, riskLevel: val || 1 });
                            } else {
                                setNewDestination({ ...newDestination, riskLevel: val || 1 });
                            }
                        }}
                        min={1} max={100}
                        className="mt-2"
                    />
                </div>
                <div className="field mb-4">
                    <label htmlFor="lastChecked" className="font-bold">Last Checked</label>
                    <Calendar
                        id="lastChecked"
                        value={selectedDestination ? new Date(selectedDestination.lastChecked) : new Date(newDestination.lastChecked)}
                        onChange={(e) => {
                            const dateString = e.value ? e.value.toISOString().split('T')[0] : '';
                            if (selectedDestination) {
                                setSelectedDestination({ ...selectedDestination, lastChecked: dateString });
                            } else {
                                setNewDestination({ ...newDestination, lastChecked: dateString });
                            }
                        }}
                        dateFormat="yy-mm-dd"
                        showIcon
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default TravelRisk;