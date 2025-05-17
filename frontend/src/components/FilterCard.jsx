import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Checkbox } from './ui/Checkbox'; // Assuming you have a Checkbox component
import { Label } from './ui/label';

const filterData = [
  {
    filterType: "Location",
    key: "location",
    array: ["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    filterType: "Industry",
    key: "industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },
  {
    filterType: "Salary",
    key: "salary",
    array: [
      { label: "Upto 2 LPA", value: { min: 0, max: 2 } },
      { label: "2 LPA to 4 LPA", value: { min: 2, max: 4 } },
      { label: "Above 4 LPA", value: { min: 4, max: Infinity } }
    ]
  }
];

const FilterCard = () => {
  const [selectedFilter, setSelectedFilter] = useState({});
  const dispatch = useDispatch();

  const changeHandler = (key, value) => {
    setSelectedFilter(prev => {
      const updated = { ...prev };
      // Toggle off if the same filter is clicked again
      if (Array.isArray(prev[key])) {
        if (prev[key].includes(value)) {
          updated[key] = prev[key].filter(val => val !== value); // Remove the value if it's already selected
        } else {
          updated[key] = [...prev[key], value]; // Add the value if it's not already selected
        }
      } else {
        updated[key] = [value]; // If it's the first selection, make it an array
      }
      return updated;
    });
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedFilter));
  }, [selectedFilter]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      {
        filterData.map((data, index) => (
          <div key={index} className="my-4">
            <h1 className="font-bold text-lg">{data.filterType}</h1>
            <div className="space-y-2">
              {
                data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  const display = typeof item === 'string' ? item : item.label;
                  const val = typeof item === 'string' ? item : item.value;

                  return (
                    <div className="flex items-center space-x-2 my-2" key={itemId}>
                      <Checkbox
                        checked={Array.isArray(selectedFilter[data.key]) && selectedFilter[data.key].includes(val)}
                        onChange={() => changeHandler(data.key, val)}
                        id={itemId}
                      />
                      <Label htmlFor={itemId}>{display}</Label>
                    </div>
                  );
                })
              }
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default FilterCard;



