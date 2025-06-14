import React, { useEffect, useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setSingleJob } from '@/redux/jobSlice';

const Job = ({ job }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const hasApplied = job?.applications?.some(
      (application) => application.applicant === user?._id
    );
    setIsApplied(hasApplied);
  }, [job, user]);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${job._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);
        const updatedJob = {
          ...job,
          applications: [...(job.applications || []), { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Error while applying.');
    }
  };

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleSaveJob = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please log in first.');
      return;
    }

    if (!job?._id) {
      toast.error('Invalid job data.');
      return;
    }

    const res = await fetch('https://jobportal-backend-5rv2.onrender.com/api/saved-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, jobId: job._id }),
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Job saved for later!');
    } else {
      toast.error(data.message || 'Something went wrong.');
    }
  } catch (error) {
    console.error('Save job error:', error);
    toast.error('Network or server error occurred.');
  }
};


  return (
    <>
      <div className='p-4 md:p-6 rounded-md shadow-xl bg-white border border-gray-100 w-full'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1'>
          <p className='text-sm text-gray-500'>
            {daysAgoFunction(job?.createdAt) === 0
              ? 'Today'
              : `${daysAgoFunction(job?.createdAt)} days ago`}
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-3 my-4'>
          <Button className='p-6' variant='outline' size='icon'>
            <Avatar>
              <AvatarImage src={job?.company?.logo} />
            </Avatar>
          </Button>
          <div className='text-center sm:text-left'>
            <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
            <p className='text-sm text-gray-500'>India</p>
          </div>
        </div>

        <div>
          <h1 className='font-bold text-lg my-2 text-center sm:text-left'>
            {job?.title}
          </h1>
          <p className='text-sm text-gray-600 text-justify'>
            {job?.description?.length > 150
              ? job.description.slice(0, 150) + '...'
              : job.description}
          </p>
        </div>

        <div className='flex flex-wrap gap-2 mt-4 justify-center sm:justify-start'>
          <Badge className='text-blue-700 font-bold' variant='ghost'>
            {job?.position} Positions
          </Badge>
          <Badge className='text-[#F83002] font-bold' variant='ghost'>
            {job?.jobType}
          </Badge>
          <Badge className='text-[#7209b7] font-bold' variant='ghost'>
            {job?.salary} LPA
          </Badge>
        </div>

        <div className='flex flex-col sm:flex-row sm:justify-start items-center gap-3 mt-6'>
          <Button
            className='w-full sm:w-fit bg-[#7209b7]'
            onClick={() => setOpen(true)}
          >
            Details
          </Button>
          <Button
            className='w-full sm:w-fit bg-[#3182ce]'
            onClick={handleSaveJob}
          >
            Save For Later
          </Button>
        </div>
      </div>

      {/* ---------- MUI Dialog Box ---------- */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>
          <Typography variant='h5' fontWeight='bold'>
            {job?.title}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box display='flex' gap={2} mb={2} flexWrap='wrap'>
            <Chip label={`${job?.position} Positions`} color='primary' />
            <Chip label={job?.jobType} color='error' />
            <Chip label={`${job?.salary} LPA`} color='secondary' />
          </Box>
          <Box my={2}>
            <Typography>
              <strong>Company:</strong> {job?.company?.name}
            </Typography>
            <Typography>
              <strong>Description:</strong> {job?.description}
            </Typography>
            <Typography>
              <strong>Location:</strong> {job?.location}
            </Typography>
            <Typography>
                          <strong>Experience:</strong>{' '}
                          {job?.experienceLevel !== undefined ? `${job.experienceLevel} yrs` : 'Not specified'}
                        </Typography>
            
                        <Typography>
                          <strong>Total Applicants:</strong>{' '}
                          {Array.isArray(job?.applications) ? job.applications.length : 'Unknown'}
                        </Typography>
            <Typography>
              <strong>Posted Date:</strong> {job?.createdAt?.split('T')?.[0]}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} className='bg-gray-600'>
            Close
          </Button>
          <Button
            onClick={!isApplied ? applyJobHandler : null}
            disabled={isApplied}
            className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
          >
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Job;
