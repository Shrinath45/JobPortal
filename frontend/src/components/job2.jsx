import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Box,
} from '@mui/material';

const Job2 = ({ job }) => {
  const [open, setOpen] = useState(false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleSaveJob = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch('https://jobportal-backend-5rv2.onrender.com/api/saved-jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, jobId: job._id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Job saved for later!');
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Save job error:', error);
    }
  };
console.log('Job data:', job);

  return (
    <>
      <div className="p-4 sm:p-6 rounded-md shadow-xl bg-white border border-gray-100 w-full">
        {/* Date */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {daysAgoFunction(job?.createdAt) === 0
              ? 'Today'
              : `${daysAgoFunction(job?.createdAt)} days ago`}
          </p>
        </div>

        {/* Company Info */}
        <div className="flex flex-col sm:flex-row items-center gap-3 my-4">
          <Button className="p-6" variant="outline" size="icon">
            <Avatar>
              <AvatarImage src={job?.company?.logo} />
            </Avatar>
          </Button>
          <div className="text-center sm:text-left">
            <h1 className="font-medium text-lg">{job?.company?.name}</h1>
            <p className="text-sm text-gray-500">India</p>
          </div>
        </div>

        {/* Job Title + Description */}
        <div>
          <h1 className="font-bold text-lg my-2 text-center sm:text-left">{job?.title}</h1>
          <p className="text-sm text-gray-600 text-justify">{job?.description}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
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

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center sm:justify-start">
          <Button
            className="w-full sm:w-fit bg-[#7209b7]"
            onClick={() => setOpen(true)}
          >
            Details
          </Button>
          <Button
            className="w-full sm:w-fit bg-[#3182ce]"
            onClick={handleSaveJob}
          >
            Save For Later
          </Button>
        </div>
      </div>

      {/* ----------- Dialog Box ----------- */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {job?.title}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <Chip label={`${job?.position} Positions`} color="primary" />
            <Chip label={job?.jobType} color="error" />
            <Chip label={`${job?.salary} LPA`} color="secondary" />
          </Box>
          <Box my={2}>
            <Typography><strong>Company:</strong> {job?.company?.name}</Typography>
            <Typography><strong>Description:</strong> {job?.description}</Typography>
            <Typography><strong>Location:</strong> {job?.location}</Typography>
            <Typography>
              <strong>Experience:</strong>{' '}
              {job?.experienceLevel !== undefined ? `${job.experienceLevel} yrs` : 'Not specified'}
            </Typography>

            <Typography>
              <strong>Total Applicants:</strong>{' '}
              {Array.isArray(job?.applications) ? job.applications.length : 'Unknown'}
            </Typography>


            <Typography><strong>Posted Date:</strong> {job?.createdAt?.split('T')?.[0]}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} className="bg-gray-600">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Job2;
