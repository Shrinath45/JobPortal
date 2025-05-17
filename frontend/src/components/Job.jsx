import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
 const handleSaveJob = async () => {
    try {
        const userId = localStorage.getItem("userId");  // Fetch the userId from localStorage
        
        if (!userId) {
            alert("Please log in first.");
            return;
        }

        if (!job?._id) {
            alert("Invalid job data.");
            return;
        }

        const res = await fetch("http://localhost:3000/api/saved-jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, jobId: job._id }),  // Ensure both userId and jobId are included
            credentials: "include",  // Ensure the credentials (cookies) are sent
        });

        const data = await res.json();

        if (res.ok) {
            alert("Job saved for later!");
        } else {
            alert(data.message || "Something went wrong.");
        }
    } catch (error) {
        console.error("Save job error:", error);
        alert("Network or server error occurred.");
    }
};



    
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                {/* <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button> */}
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button className="bg-[#7209b7]" onClick={()=> navigate(`/description/${job?._id}`)}>Details</Button>
                <Button
                    className="bg-[#3182ce]"
                    // onClick={async () => {
                    //     try {
                    //     const response = await fetch("http://localhost:3000/api/saved-jobs", {
                    //         method: "POST",
                    //         headers: {
                    //         "Content-Type": "application/json",
                    //         },
                    //         credentials: "include",
                    //         body: JSON.stringify({
                    //         userId: localStorage.getItem("userId"), // Make sure user ID is stored
                    //         jobId: job._id,
                    //         }),
                    //     });

                    //     const result = await response.json();
                    //     if (response.ok) {
                    //         alert("Job saved!");
                    //     } else {
                    //         alert(result.message);
                    //     }
                    //     } catch (err) {
                    //     console.error("Error saving job:", err);
                    //     }
                    // }}

                    onClick={handleSaveJob}
                    >
                    Save For Later
                    </Button>
            </div>
        </div>
    )
}

export default Job