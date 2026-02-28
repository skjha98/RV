import { useState, useEffect, useMemo, useCallback } from 'react';

export interface TableRow {
    id: number;
    [key: string]: string | number | boolean | null | undefined;
}

export function useTableData(activeTable: string) {
    const [data, setData] = useState<TableRow[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    // 1. Move resets inside the async callback to avoid "synchronous" cascading updates
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`/api/${activeTable}`);
            const json = await response.json();
            
            // Batch these updates together
            setData(Array.isArray(json) ? json : []);
            setSearchTerm('');
            setSortConfig(null);
        } catch (e) {
            console.error("Fetch error", e);
            setData([]);
        }
    }, [activeTable]);

    // 2. Now the effect body only triggers the async flow
    useEffect(() => {
        let isMounted = true;
        
        const load = async () => {
            if (isMounted) {
                await fetchData();
            }
        };

        load();

        return () => { isMounted = false; };
    }, [fetchData]); // Only depends on the memoized fetchData

    const processedData = useMemo(() => {
        let result = [...data];
        if (searchTerm) {
            result = result.filter(item => 
                Object.values(item).some(val => 
                    String(val ?? '').toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key] ?? '';
                const bVal = b[sortConfig.key] ?? '';
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [data, searchTerm, sortConfig]);

    return { 
        processedData, 
        searchTerm, 
        setSearchTerm, 
        sortConfig, 
        setSortConfig, 
        fetchData 
    };
}