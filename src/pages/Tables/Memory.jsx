import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "../../utils/Datatable";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Sidebar from "../../layout/Sidebar";
const Memory = () => {
  const [dashboardData, setDashboardData] = useState({
    donations: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("https://sucheta.traficoanalytica.com/api/v1/enquiry/get-in-memory-donations");
      const result = await response.json();
      if (result?.statusCode === 200 && Array.isArray(result.data)) {
        setDashboardData({ donations: result.data });
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setDashboardData(prev => ({
      ...prev,
      donations: prev.donations.map(donation =>
        donation._id === id ? { ...donation, status: newStatus } : donation
      ),
    }));
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
        `https://sucheta.traficoanalytica.com/api/v1/enquiry/delete-in-memory-donation`,
        { id }
      );

      // Update state to remove the deleted donation
      setDashboardData(prev => ({
        ...prev,
        donations: prev.donations.filter(donation => donation._id !== id)
      }));
      
      console.log(`Donation ${id} deleted successfully`);
    } catch (err) {
      console.error(`Failed to delete donation ${id}:`, err);
      alert("Failed to delete donation. Please try again.");
    }
  };

  const columns = [
    {
      accessorKey: "fullName",
      header: "Name",
    },
    {
      accessorKey: "mobileNumber",
      header: "Mobile",
    },
    {
      accessorKey: "alternateMobileNumber",
      header: "Alternate Mobile",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "birthdate",
      header: "Birthdate",
      cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-",
    },
    {
      accessorKey: "citizenship",
      header: "Citizenship",
    },
    {
      accessorKey: "wants80GCertificate",
      header: "80G Certificate",
      cell: info => (
        <Badge className={info.getValue() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {info.getValue() ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "donationType",
      header: "Donation Type",
    },
    {
      accessorKey: "honoreeName",
      header: "Honoree",
    },
    {
      accessorKey: "relationshipWithHonoree",
      header: "Relationship",
    },
    {
      accessorKey: "occasionName",
      header: "Occasion",
    },
    {
      accessorKey: "occasionDate",
      header: "Occasion Date",
      cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-",
    },
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
        <h1 className="text-2xl font-bold mb-4">In-Memory Donations</h1>
        <DataTable columns={columns} data={dashboardData.donations} />
      </div>
    </Sidebar>
  );
};

export default Memory;