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
import { MoreVertical } from "lucide-react";
import Sidebar from "../../layout/Sidebar";
import axios from "axios";

const Ocassional = () => {
  const [dashboardData, setDashboardData] = useState({
    donations: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://sucheta.traficoanalytica.com/api/v1/enquiry/get-special-occasion-donations");
      const result = await res.json();
      if (result.success) {
        setDashboardData({ donations: result.data });
      } else {
        console.error("Failed to fetch donations:", result.message);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };
  
  const handleDeleteDonation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    );
    if (!confirmDelete) return;

    console.log(`Attempting to delete donation with ID: ${id}`);
    try {

      await axios.post(
        `http://sucheta.traficoanalytica.com/api/v1/enquiry//delete-special-occasion-donation`,
        { id }
      );


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

  const handleStatusChange = (id, newStatus) => {
    setDashboardData(prev => ({
      ...prev,
      donations: prev.donations.map(donation =>
        donation._id === id ? { ...donation, status: newStatus } : donation
      ),
    }));
  };

  const columns = [
    {
      accessorKey: "occasionDate",
      header: "Occasion Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: "occasionName",
      header: "Occasion Name",
    },
    {
      accessorKey: "honoreeName",
      header: "Honoree Name",
    },
    {
      accessorKey: "relationshipWithHonoree",
      header: "Relation",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobileNumber",
      header: "Mobile",
    },
    {
      accessorKey: "fullName",
      header: "Name",
    },
    {
      accessorKey: "birthdate",
      header: "Birthdate",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: "citizenship",
      header: "Citizenship",
    },
    {
      accessorKey: "wants80GCertificate",
      header: "Certificate",
      cell: (info) => (
        <Badge className={info.getValue() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {info.getValue() ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: "donationType",
      header: "Donation Type",
    },
    {
      accessorKey: "_id",
      header: "Donation ID",
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
        <DataTable columns={columns} data={dashboardData.donations} />
      </div>
    </Sidebar>
  );
};

export default Ocassional;
