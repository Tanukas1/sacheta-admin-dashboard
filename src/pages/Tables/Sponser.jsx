import React, { useState, useEffect } from "react";
import { DataTable } from "../../utils/Datatable";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import Sidebar from "../../layout/Sidebar";
import toast from "react-hot-toast";
import axios from "axios";

const Sponser = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("https://sucheta.traficoanalytica.com/api/v1/enquiry/get-in-sponsor-donations"); // Replace with your actual endpoint
      const result = await response.json();
      if (result.success) {
        setDonations(result.data);
      } else {
        toast.error("Failed to fetch donations");
      }
    } catch (error) {
      toast.error("Error fetching donations");
    }
  };

  const handleDeleteDonation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    );
    if (!confirmDelete) return;
  
    console.log(`Attempting to delete donation with ID: ${id}`);
    try {
      // Using POST method and sending ID in the request body
      await axios.post(
        `https://sucheta.traficoanalytica.com/api/v1/enquiry/delete-in-sponsor-donation`,
        { id }
      );
  
      // Update the donations state directly
      setDonations(prev => prev.filter(donation => donation._id !== id));
      
      toast.success("Donation deleted successfully");
      console.log(`Donation ${id} deleted successfully`);
    } catch (err) {
      console.error(`Failed to delete donation ${id}:`, err);
      toast.error("Failed to delete donation. Please try again.");
    }
  };
  const handleStatusChange = (id, newStatus) => {
    setDonations((prev) =>
      prev.map((donation) =>
        donation._id === id ? { ...donation, status: newStatus } : donation
      )
    );
    toast.success(`Status updated to ${newStatus}`);
  };

  const columns = [
    { accessorKey: "fullName", header: "Name" },
    { accessorKey: "mobileNumber", header: "Mobile" },
    { accessorKey: "alternateMobileNumber", header: "Alt. Mobile" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "birthdate",
      header: "Birthdate",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    { accessorKey: "citizenship", header: "Citizenship" },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    { accessorKey: "panNumber", header: "PAN Number" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "pinCode", header: "Pincode" },
    {
      accessorKey: "certificateDetails.panCardNumber",
      header: "Certificate PAN",
      cell: ({ row }) =>
        row.original.wants80GCertificate
          ? row.original.certificateDetails?.panCardNumber || ""
          : "",
    },
    {
      accessorKey: "certificateDetails.certificateAddress",
      header: "Certificate Address",
      cell: ({ row }) =>
        row.original.wants80GCertificate
          ? row.original.certificateDetails?.certificateAddress || ""
          : "",
    },
    {
      accessorKey: "certificateDetails.certificatePinCode",
      header: "Certificate Pincode",
      cell: ({ row }) =>
        row.original.wants80GCertificate
          ? row.original.certificateDetails?.certificatePinCode || ""
          : "",
    },
    {
      accessorKey: "certificateDetails.certificateCity",
      header: "Certificate City",
      cell: ({ row }) =>
        row.original.wants80GCertificate
          ? row.original.certificateDetails?.certificateCity || ""
          : "",
    },
    {
      accessorKey: "certificateDetails.certificateState",
      header: "Certificate State",
      cell: ({ row }) =>
        row.original.wants80GCertificate
          ? row.original.certificateDetails?.certificateState || ""
          : "",
    },
    {
      accessorKey: "certificateDetails.preferenceState",
      header: "Preference State",
    
      cell: (info) =>
        info.getValue() ? `${info.getValue()}` : "Not Specified",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => (
        <Badge
          className={
            info.getValue() === "completed"
              ? "bg-green-100 text-green-800"
              : info.getValue() === "failed"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {info.getValue() || "pending"}
        </Badge>
      ),
    },
    {
             id: "actions",
             header: "Actions",
             cell: ({ row }) => (
               <Button
                 variant="destructive"
                 size="sm"
                 onClick={() => handleDeleteDonation(row.original._id)}
               >
                 Delete
               </Button>
             ),
           },
  ];

  return (
    <Sidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Donations</h1>
        <DataTable columns={columns} data={donations} />
      </div>
    </Sidebar>
  );
};

export default Sponser;
