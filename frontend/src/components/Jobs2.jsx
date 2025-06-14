import React, { useEffect, useState } from 'react';
import FilterCard from './FilterCard';
import Job2 from './job2';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Navbar2 from './shared/Navbar2';

const Jobs2 = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);

  useEffect(() => {
    const isQueryEmpty =
      !searchedQuery ||
      (typeof searchedQuery === 'object' && Object.keys(searchedQuery).length === 0);

    if (isQueryEmpty) {
      setFilterJobs(allJobs);
    } else {
      const { location = [], industry = [], salary = [] } = searchedQuery;

      const filteredJobs = allJobs.filter((job) => {
        const jobLocation = job.location?.toLowerCase() || '';
        const jobIndustry = job.title?.toLowerCase() || '';
        const jobSalary = parseFloat(job.salary);

        const matchLocation =
          location.length === 0 || location.some((loc) => jobLocation.includes(loc.toLowerCase()));

        const matchIndustry =
          industry.length === 0 || industry.some((ind) => jobIndustry.includes(ind.toLowerCase()));

        const matchSalary =
          salary.length === 0 ||
          salary.some(({ min, max }) => jobSalary >= min && jobSalary <= max);

        return matchLocation && matchIndustry && matchSalary;
      });

      setFilterJobs(filteredJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar2 />
      <div className="max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter (Full width on mobile) */}
          <div className="w-full lg:w-1/4">
            <FilterCard />
          </div>

          {/* Job Cards */}
          <div className="w-full lg:w-3/4">
            {filterJobs.length <= 0 ? (
              <span className="text-lg font-semibold text-gray-600 block mt-4">Job not found</span>
            ) : (
              <div className="h-[75vh] overflow-y-auto pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterJobs.map((job) => (
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      key={job?._id}
                    >
                      <Job2 job={job} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs2;
