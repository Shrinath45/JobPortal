import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  // Optional: sort jobs by most recent date
  const sortedAppliedJobs = [...allAppliedJobs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                You haven't applied to any job yet.
              </TableCell>
            </TableRow>
          ) : (
            sortedAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>{appliedJob?.createdAt?.split('T')[0]}</TableCell>
                <TableCell>{appliedJob.job?.title}</TableCell>
                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={
                      appliedJob?.status === 'rejected'
                        ? 'bg-red-400'
                        : appliedJob.status === 'pending'
                        ? 'bg-gray-400'
                        : 'bg-green-400'
                    }
                  >
                    {appliedJob.status?.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TableCaption>A list of your applied jobs</TableCaption>
      </Table>
    </div>
  );
};

export default AppliedJobTable;

