// client/src/pages/TravelRisk.tsx
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Slider } from 'primereact/slider'; // For riskLevel number input
import { InputNumber } from 'primereact/inputnumber'; // For explicit number input for riskLevel

import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

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
                    onValueChange={(e) => options.editorCallback?.(e.value || 0)}
                    min={1} max={100}
                    mode="decimal"
                    showButtons
                    autoFocus
                />
                <Slider
                    value={options.value}
                    onChange={(e) => options.editorCallback?.(Array.isArray(e.value) ? e.value[0] : e.value || 0)}
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
                onChange={(e) => options.editorCallback?.(e.value ? e.value.toISOString().split('T')[0] : '')}
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
                onChange={(e) => options.editorCallback?.(e.value)}
                placeholder="Select a Location"
                filter
                showClear
                autoFocus
            />
        );
    };

    const getRiskSeverity = (riskLevel: number) => {
        if (riskLevel >= 80) return 'danger';
        if (riskLevel >= 60) return 'warning';
        if (riskLevel >= 40) return 'info';
        return 'success';
    };

    const getRiskIcon = (riskLevel: number) => {
        if (riskLevel >= 80) return 'pi pi-exclamation-triangle';
        if (riskLevel >= 60) return 'pi pi-exclamation-circle';
        if (riskLevel >= 40) return 'pi pi-info-circle';
        return 'pi pi-check-circle';
    };

    const riskLevelBodyTemplate = (rowData: Destination) => (
        <div className="flex items-center gap-2">
            <Tag 
                value={rowData.riskLevel} 
                severity={getRiskSeverity(rowData.riskLevel)}
                icon={getRiskIcon(rowData.riskLevel)}
                className="font-semibold"
            />
        </div>
    );

    const locationBodyTemplate = (rowData: Destination) => (
        <div className="flex items-center gap-2">
            <i className="pi pi-map-marker text-blue-500"></i>
            <span className="font-medium">{rowData.location}</span>
        </div>
    );

    const actionBodyTemplate = (rowData: Destination) => (
        <div className="flex justify-center gap-1">
            <Button 
                icon="pi pi-pencil" 
                rounded 
                outlined 
                size="small"
                onClick={() => editDestination(rowData)}
                tooltip="Edit destination"
                tooltipOptions={{ position: 'top' }}
            />
            <Button 
                icon="pi pi-refresh" 
                rounded 
                outlined 
                severity="info"
                size="small"
                onClick={() => requestCountryUpdate(rowData.location)}
                tooltip="Request country update"
                tooltipOptions={{ position: 'top' }}
            />
            <Button 
                icon="pi pi-trash" 
                rounded 
                outlined 
                severity="danger" 
                size="small"
                onClick={() => deleteDestination(rowData._id!)}
                tooltip="Delete destination"
                tooltipOptions={{ position: 'top' }}
            />
        </div>
    );

    const dialogFooter = (
        <div className="flex justify-end gap-3 pt-4">
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                outlined 
                onClick={hideDialog}
                className="px-6"
            />
            <Button 
                label="Save" 
                icon="pi pi-check" 
                onClick={saveDestination}
                className="px-6 font-semibold"
            />
        </div>
    );

    return (
        <div className="min-h-screen p-6">
            <Toast ref={toast} />
            <ConfirmDialog />

          <div className="grid grid-cols-1 items-center h-full">

            <div className="p-8 flex flex-col items-center justify-between mb-6">
              <div className="text-center mb-6">
                  <h1 className="text-4xl font-bold text-gray-800">Travel Risk Assessment</h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                      Monitor and manage travel risks for destinations worldwide. Track risk levels, update assessments, and make informed travel decisions.
                  </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-4xl">
                  {/* Search Input */}
                  <div className="flex-1 w-full sm:w-auto">
                      <InputText
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Search destinations..."
                          className="w-full"
                      />
                  </div>
                  
                  {/* Multi-Country Select */}
                  <div className="flex-1 w-full sm:w-auto">
                      <MultiSelect
                          value={selectedCountries}
                          options={locationOptions}
                          onChange={(e) => handleCountrySelection(e.value)}
                          placeholder="Select countries to filter..."
                          display="chip"
                          className="w-full"
                          maxSelectedLabels={3}
                          showSelectAll
                          selectAllLabel="Select All"
                          filter
                      />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                      <Button
                          label="Clear Filters"
                          icon="pi pi-filter-slash"
                          outlined
                          onClick={clearFilters}
                          disabled={!searchQuery && selectedCountries.length === 0}
                          className="font-semibold"
                      />
                      <Button
                          label="New Destination" 
                          icon="pi pi-plus" 
                          severity="success" 
                          onClick={openNew}
                          className="font-semibold"
                      />
                  </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="overflow-hidden flex flex-col items-center justify-center w-full">
                    <div className="">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center py-16">
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                                <p className="mt-4 text-lg text-blue-600 font-medium">Loading destinations...</p>
                            </div>
                        ) : globalError ? (
                            <div className="text-center py-16">
                                <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                                <p className="text-lg text-red-600 font-medium">{globalError}</p>
                            </div>
                        ) : (
                            <DataTable
                                    value={destinations}
                                    editMode="cell"
                                    tableStyle={{ minWidth: '50rem' }}
                                    emptyMessage={searchQuery || selectedCountries.length > 0 ? 
                                        "No destinations match your search criteria. Try adjusting your filters." : 
                                        "No destinations found. Click 'New Destination' to get started."
                                    }
                                    className="p-datatable-striped"
                                    dataKey="_id"
                                    paginator
                                    rows={10}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} destinations"
                                >
                                <Column
                                    field="_id"
                                    header="ID"
                                    style={{ width: '12%' }}
                                    body={(rowData: Destination) => (
                                        <Badge 
                                            value={rowData._id?.substring(0, 8)} 
                                            severity="info"
                                            className="font-mono text-xs"
                                        />
                                    )}
                                />
                                <Column
                                    field="location"
                                    header="Location"
                                    style={{ width: '28%' }}
                                    editor={locationEditor}
                                    onCellEditComplete={onCellEditComplete}
                                    body={locationBodyTemplate}
                                />
                                <Column
                                    field="riskLevel"
                                    header="Risk Level"
                                    style={{ width: '20%' }}
                                    editor={riskLevelEditor}
                                    onCellEditComplete={onCellEditComplete}
                                    body={riskLevelBodyTemplate}
                                />
                                <Column
                                    field="lastChecked"
                                    header="Last Checked"
                                    style={{ width: '20%' }}
                                    editor={dateEditor}
                                    onCellEditComplete={onCellEditComplete}
                                    body={(rowData: Destination) => (
                                        <div className="flex items-center gap-2">
                                            <i className="pi pi-calendar text-gray-500"></i>
                                            <span>{rowData.lastChecked}</span>
                                        </div>
                                    )}
                                />
                                <Column
                                    body={actionBodyTemplate}
                                    exportable={false}
                                    style={{ minWidth: '8rem', width: '20%' }}
                                    header="Actions"
                                />
                                </DataTable>
                        )}
                    </div>
                </div>
            </div>
          </div>

            {/* Add/Edit Destination Dialog */}
            <Dialog
                visible={displayDialog}
                style={{ width: '500px' }}
                header={
                    <div className="flex items-center gap-3">
                        <i className={`pi ${selectedDestination ? 'pi-pencil' : 'pi-plus'} text-2xl text-blue-600`}></i>
                        <span className="text-xl font-semibold">
                            {selectedDestination ? "Edit Destination" : "New Destination"}
                        </span>
                    </div>
                }
                modal
                className="p-fluid"
                footer={dialogFooter}
                onHide={hideDialog}
            >
                <div className="space-y-6 pt-4">
                    <div className="field">
                        <label htmlFor="location" className="font-bold text-gray-700 flex items-center gap-2 mb-2">
                            <i className="pi pi-map-marker text-blue-500"></i>
                            Location
                        </label>
                        <Dropdown
                            id="location"
                            value={selectedDestination ? selectedDestination.location : newDestination.location}
                            options={locationOptions}
                            onChange={(e) => selectedDestination ? setSelectedDestination({ ...selectedDestination, location: e.value }) : setNewDestination({ ...newDestination, location: e.value })}
                            placeholder="Select a Location"
                            required
                            filter
                            showClear
                            className={`w-full ${submitted && (!selectedDestination && !newDestination.location) ? 'p-invalid' : ''}`}
                        />
                        {submitted && (!selectedDestination && !newDestination.location) && <small className="p-error">Location is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="riskLevel" className="font-bold text-gray-700 flex items-center gap-2 mb-2">
                            <i className="pi pi-exclamation-triangle text-orange-500"></i>
                            Risk Level (1-100)
                        </label>
                        <InputNumber
                            id="riskLevel"
                            value={selectedDestination ? selectedDestination.riskLevel : newDestination.riskLevel}
                            onValueChange={(e) => {
                                const val = e.value !== null && e.value !== undefined ? e.value : 1;
                                if (selectedDestination) {
                                    setSelectedDestination({ ...selectedDestination, riskLevel: val });
                                } else {
                                    setNewDestination({ ...newDestination, riskLevel: val });
                                }
                            }}
                            min={1} max={100}
                            showButtons
                            className={`w-full ${submitted && (!selectedDestination && (newDestination.riskLevel < 1 || newDestination.riskLevel > 100)) ? 'p-invalid' : ''}`}
                        />
                        {submitted && (!selectedDestination && (newDestination.riskLevel < 1 || newDestination.riskLevel > 100)) && <small className="p-error">Risk Level must be between 1 and 100.</small>}
                        <Slider
                            value={selectedDestination ? selectedDestination.riskLevel : newDestination.riskLevel}
                            onChange={(e) => {
                                const val = Array.isArray(e.value) ? e.value[0] : e.value;
                                const riskLevel = val !== null && val !== undefined ? val : 1;
                                if (selectedDestination) {
                                    setSelectedDestination({ ...selectedDestination, riskLevel });
                                } else {
                                    setNewDestination({ ...newDestination, riskLevel });
                                }
                            }}
                            min={1} max={100}
                            className="mt-3"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>Low Risk</span>
                            <span>High Risk</span>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="lastChecked" className="font-bold text-gray-700 flex items-center gap-2 mb-2">
                            <i className="pi pi-calendar text-green-500"></i>
                            Last Checked
                        </label>
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
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default TravelRisk;