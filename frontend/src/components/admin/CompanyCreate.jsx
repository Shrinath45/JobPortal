import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState(""); // Fixed: Set default empty string
    const [loading, setLoading] = useState(false); // Added: To show loading state

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            toast.error("Company name cannot be empty!");
            return;
        }

        setLoading(true); // Show loading state
        try {
            console.log("Sending request to:", `${COMPANY_API_END_POINT}/register`);
            console.log("Data being sent:", { companyName });

            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            console.log("Response received:", res);

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                navigate(`/admin/companies/${res.data.company._id}`);
            } else {
                toast.error("Something went wrong while creating the company.");
            }
        } catch (error) {
            console.error("Error creating company:", error);
            toast.error(error.response?.data?.message || "Failed to create company.");
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to name your company? You can change this later.</p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="JobHunt, Microsoft, etc."
                    value={companyName} // Fixed: Controlled input
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button onClick={registerNewCompany} disabled={loading}>
                        {loading ? "Please wait..." : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
