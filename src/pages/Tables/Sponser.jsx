import React, { useState, useEffect } from "react";
import DataTable from "@/utils/DataTable";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

const Sponser = () => {
  const [dashboardData, setDashboardData] = useState({
    donations: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Mock data for demonstration
    const mockDonations = [
      {
        _id: "don1",
        name: "Amit Kumar",
        phone: "9876543210",
        email: "amit@example.com",
        Birthdate: "1990-01-01",
        citizenship: "Indian Citizen",
        ["pan number"]: "ABCDE1234F",
        address: "123 MG Road, New Delhi",
        pincode: "110001",
        city: "New Delhi",
        state: "Delhi",
        preferenceState: "Maharashtra",
        donationType: "Once",
        amount: 2500,
        certificate: true,
        createdAt: "2025-04-15T10:30:00Z",
        status: "completed",
      },
      {
        _id: "don2",
        name: "Sarah Johnson",
        phone: "8765432109",
        email: "sarah@example.com",
        Birthdate: "1985-07-20",
        citizenship: "Foreign National",
        ["pan number"]: "XYZWE5678K",
        address: "45 Ocean Drive, Miami",
        pincode: "33101",
        city: "Miami",
        state: "Florida",
        preferenceState: "California",
        donationType: "Monthly",
        amount: 5000,
        certificate: true,
        createdAt: "2025-05-01T14:45:00Z",
        status: "processing",
      },
    ];
    

    setDashboardData({
      donations: mockDonations,
    });
  };

  const columns = [
    {
        accessorKey: "occasion date",
        header: "Occasion Date",
      },
      {
        accessorKey: "occasion name",
        header: "Occasion Name",
      },
      {
        accessorKey: "honoree name",
        header: "Honoree Name",
      },
      {
          accessorKey: "relation",
          header: "Relation",
      },
      {
          accessorKey: "honoree email",
          header: "Honoree Email",
      },
      {
          accessorKey: "honoree phone",
          header: "Honoree Phone",
      },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "phone",
      header: "Mobile",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "Birthdate",
      header: "Birthdate",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "citizenship",
      header: "Citizenship",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "certificate",
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
      accessorKey: "pan number",
      header: "PAN Number",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey : "address",
      header: "Address",
      cell: (info) => info.getValue(),

    },
    {
      accessorKey: "pincode",
      header: "Pincode",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "city",
      header: "City",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "state",
      header: "State",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "preferenceState",
      header: "Preference State",
      cell: (info) => info.getValue(),
    },

  
    {
      accessorKey: "donationType",
      header: "Donation Type",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => `₹${info.getValue()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => (
        <Badge className={info.getValue() === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
          {info.getValue()}
        </Badge>
      ),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusChange(row.original._id, "processing")}>
              Mark as Processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(row.original._id, "completed")}>
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(row.original._id, "failed")}>
              Mark as Failed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleStatusChange = (id, newStatus) => {
    setDashboardData(prev => ({
      ...prev,
      donations: prev.donations.map(donation => 
        donation._id === id ? { ...donation, status: newStatus } : donation
      )
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Donations</h1>
      <DataTable columns={columns} data={dashboardData.donations} />
    </div>
  );
};

export default Sponser;