import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';

const Saved = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch(`https://jobportal-backend-5rv2.onrender.com/api/saved-jobs/${userId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data); // Log the response to inspect the data
      setSavedJobs(data);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const res = await fetch(`https://jobportal-backend-5rv2.onrender.com/api/v1/application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId, jobId }),
      });
      if (res.ok) {
        alert("Application submitted successfully!");
      }
    } catch (err) {
      console.error("Failed to apply:", err);
    }
  };

  const handleRemove = async (savedJobId) => {
    try {
      const res = await fetch(`https://jobportal-backend-5rv2.onrender.com/api/saved-jobs/${savedJobId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) fetchSavedJobs();
    } catch (err) {
      console.error('Failed to remove job:', err);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
      {savedJobs.length === 0 ? (
        <p className="text-gray-600">You haven't saved any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(({ _id, job }) => (
            <div key={_id} className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">
                  {new Date(job.createdAt).toDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3 my-2">
                <Button variant="outline" size="icon" className="p-4">
                  <Avatar>
                    {/* Add a fallback logo if company logo is missing */}
                    <AvatarImage src={job?.company?.logo || 'default-logo.png'} />
                  </Avatar>
                </Button>
                <div>
                  <h1 className="font-medium text-lg">
                    {/* Fallback company name if missing */}
                    {job?.company?.name || 'Unknown Company'}
                  </h1>
                  <p className="text-sm text-gray-500">India</p>
                </div>
              </div>

              <h1 className="font-bold text-lg my-2">{job?.title}</h1>
              <p className="text-sm text-gray-600 line-clamp-3">{job?.description}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="text-blue-700 font-bold" variant="ghost">
                  {job?.position} Positions
                </Badge>
                <Badge className="text-[#F83002] font-bold" variant="ghost">
                  {job?.jobType}
                </Badge>
                <Badge className="text-[#7209b7] font-bold" variant="ghost">
                  {job?.salary} LPA
                </Badge>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <Button
                  variant="destructive"
                  onClick={() => handleRemove(_id)}
                >
                  Remove
                </Button>
                <Button className="bg-[#7209b7]" onClick={() => navigate(`/description/${job._id}`)}>
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
