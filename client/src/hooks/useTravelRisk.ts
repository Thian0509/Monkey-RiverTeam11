import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { useAuth } from './useAuth';

export interface GeoJsonFeature {
    type: "Feature";
    properties: {
        name: string;
        iso_a2?: string;
        name_long?: string;
    };
    geometry: any;
}

export interface Destination {
    _id?: string;
    location: string;
    riskLevel: number;
    lastChecked: string;
}

export const useTravelRisk = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [newDestination, setNewDestination] = useState<Destination>({
        location: '',
        riskLevel: 50,
        lastChecked: new Date().toISOString().split('T')[0]
    });
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [locationOptions, setLocationOptions] = useState<{ label: string; value: string }[]>([]);
    
    const toast = useRef<Toast>(null);
    const { token } = useAuth();
    const API_BASE_URL = 'http://localhost:5050/api/destinations';

    const loadGeoJsonData = async () => {
        try {
            const response = await fetch('/custom.geo.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const options = data.features.map((feature: GeoJsonFeature) => ({
                label: feature.properties.name_long || feature.properties.name,
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
            setFilteredDestinations(response.data);
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
            const newDestinations = [...destinations, response.data];
            setDestinations(newDestinations);
            applyFilters(newDestinations, searchQuery, selectedCountries);
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
            const updatedDestinations = destinations.map(dest => (dest._id === destinationToUpdate._id ? response.data : dest));
            setDestinations(updatedDestinations);
            applyFilters(updatedDestinations, searchQuery, selectedCountries);
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
                    const updatedDestinations = destinations.filter(dest => dest._id !== _id);
                    setDestinations(updatedDestinations);
                    applyFilters(updatedDestinations, searchQuery, selectedCountries);
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

    const onCellEditComplete = (e: any) => {
        let { rowData, newValue, field } = e;

        if (newValue !== rowData[field]) {
            let updatedDestinations = [...destinations];
            let targetIndex = updatedDestinations.findIndex(d => d._id === rowData._id);

            if (targetIndex !== -1) {
                const tempUpdatedRow = { ...rowData, [field]: newValue };
                const newDestinations = updatedDestinations.map((d, i) => (i === targetIndex ? tempUpdatedRow : d));
                setDestinations(newDestinations);
                applyFilters(newDestinations, searchQuery, selectedCountries);
                updateDestination(tempUpdatedRow);
            }
        }
    };

    const applyFilters = (destinationList: Destination[], search: string, countries: string[]) => {
        let filtered = destinationList;
        
        // Apply search filter
        if (search.trim()) {
            filtered = filtered.filter(dest => 
                dest.location.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        // Apply country filter
        if (countries.length > 0) {
            filtered = filtered.filter(dest => 
                countries.includes(dest.location)
            );
        }
        
        setFilteredDestinations(filtered);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        applyFilters(destinations, query, selectedCountries);
    };

    const handleCountrySelection = (countries: string[]) => {
        setSelectedCountries(countries);
        applyFilters(destinations, searchQuery, countries);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCountries([]);
        setFilteredDestinations(destinations);
    };

    const requestCountryUpdate = async (countryName: string) => {
        try {
            if (!token) throw new Error('Not authenticated.');
            
            // This would typically call an API endpoint to request a country update
            // For now, we'll just show a success message
            toast.current?.show({
                severity: 'success',
                summary: 'Update Requested',
                detail: `Risk update requested for ${countryName}. You will be notified when new data is available.`,
                life: 5000
            });
        } catch (err: any) {
            console.error("Error requesting country update:", err);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: err.response?.data?.message || 'Failed to request country update',
                life: 5000
            });
        }
    };

    useEffect(() => {
        loadGeoJsonData();
    }, []);

    useEffect(() => {
        if (token) {
            fetchDestinations();
        } else {
            setLoading(false);
            setGlobalError('Please log in to view and manage destinations.');
            setDestinations([]);
            setFilteredDestinations([]);
        }
    }, [token]);

    return {
        destinations: filteredDestinations,
        allDestinations: destinations,
        loading,
        globalError,
        displayDialog,
        selectedDestination,
        selectedCountries,
        searchQuery,
        newDestination,
        submitted,
        locationOptions,
        toast,
        openNew,
        hideDialog,
        saveDestination,
        editDestination,
        deleteDestination,
        onCellEditComplete,
        setSelectedDestination,
        setNewDestination,
        handleSearch,
        handleCountrySelection,
        clearFilters,
        requestCountryUpdate
    };
};