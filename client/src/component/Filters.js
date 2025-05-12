import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const Filters = ({ filterOptions, sortOptions, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({});
    const [selectedSort, setSelectedSort] = useState('');

    const handleFilterChange = (key, value) => {
        const updatedFilters = { ...selectedFilters, [key]: value };
        setSelectedFilters(updatedFilters);
        onFilterChange({ filters: updatedFilters, sort: selectedSort });
    };

    const handleSortChange = (event) => {
        setSelectedSort(event.target.value);
        onFilterChange({ filters: selectedFilters, sort: event.target.value });
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, pt: 2, bgcolor: 'background.paper', borderRadius: 1, flexWrap: 'wrap' }}>
            {filterOptions.map((filter) => (
                <FormControl size='small' key={filter.key} sx={{ minWidth: 120, flex: 1 }}>
                    <InputLabel id={`${filter.key}-label`}>{filter.label}</InputLabel>
                    <Select
                        labelId={`${filter.key}-label`}
                        id={filter.key}

                        value={selectedFilters[filter.key] || ''}
                        label={filter.label}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    >
                        <MenuItem value="">{filter.defaultOption || 'All'}</MenuItem>
                        {filter.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ))}
            {sortOptions && (
                <FormControl size='small' sx={{ minWidth: 120, flex: 1 }}>
                    <InputLabel id="sort-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-label"
                        id="sort"
                        value={selectedSort}
                        label="Sort By"
                        onChange={handleSortChange}
                    >
                        <MenuItem value="">{sortOptions.defaultOption || 'Default'}</MenuItem>
                        {sortOptions.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
};

export default Filters;