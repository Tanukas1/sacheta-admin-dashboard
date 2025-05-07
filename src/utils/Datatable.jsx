import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, SlidersHorizontal, Columns, ArrowUp, ArrowDown, X, Check } from "lucide-react";

// Modern UI components
const Table = ({ children, className = "" }) => (
  <table className={`w-full border-collapse ${className}`}>
    {children}
  </table>
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody = ({ children }) => <tbody>{children}</tbody>;

const TableRow = ({ children, className = "" }) => (
  <tr className={`border-b transition-colors hover:bg-gray-50/50 ${className}`}>
    {children}
  </tr>
);

const TableHead = ({ children, className = "" }) => (
  <th className={`p-3 text-left font-medium text-gray-600 ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`p-3 ${className}`}>{children}</td>
);

const Input = ({ className = "", icon, ...props }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      className={`w-full rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
        icon ? "pl-9" : ""
      } ${className}`}
      {...props}
    />
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
};

const Checkbox = ({ id, className = "", checked, onCheckedChange, ...props }) => (
  <div className="relative flex h-5 w-5 items-center justify-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-colors checked:border-blue-500 checked:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
      {...props}
    />
    <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
  </div>
);

const Button = ({ 
  children, 
  variant = "default", 
  size = "md", 
  className = "", 
  icon,
  ...props 
}) => {
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50",
    outline: "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200/50",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200/50",
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    icon: "p-2",
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

const Dropdown = ({ 
  button, 
  children, 
  isOpen, 
  setIsOpen, 
  align = "right", 
  className = "" 
}) => {
  const alignClasses = {
    right: "right-0",
    left: "left-0",
  };

  return (
    <div className="relative">
      {button}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className={`absolute ${alignClasses[align]} z-30 mt-1 min-w-[200px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg ${className}`}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

const DropdownItem = ({ children, onClick, className = "", active = false }) => (
  <button
    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
      active ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const DataTable = ({ columns, data }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Toggle all columns visibility
  const toggleAllColumns = (value) => {
    table.getAllColumns().forEach((column) => {
      column.toggleVisibility(!!value);
    });
  };

  // Count visible columns
  const visibleColumnsCount = table.getAllColumns().filter(col => col.getIsVisible()).length;
  const totalColumnsCount = table.getAllColumns().length;

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Global Filter */}
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search all columns..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Column Filter Toggle */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowColumnFilters(!showColumnFilters)}
            icon={<SlidersHorizontal className="h-4 w-4" />}
          >
            {columnFilters.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                {columnFilters.length}
              </span>
            )}
          </Button> */}

          {/* Column Visibility Menu */}
          <Dropdown
            button={
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                icon={<Columns className="h-4 w-4" />}
              >
                {visibleColumnsCount < totalColumnsCount && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {totalColumnsCount - visibleColumnsCount}
                  </span>
                )}
              </Button>
            }
            isOpen={showVisibilityMenu}
            setIsOpen={setShowVisibilityMenu}
          >
            <div className="border-b border-gray-100 p-2">
              <div className="flex items-center justify-between">
                {/* <p className="text-sm font-medium text-gray-700">Toggle Columns</p> */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => toggleAllColumns(true)}
                  >
                    Show all
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => toggleAllColumns(false)}
                  >
                    Hide all
                  </Button>
                </div>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {table.getAllColumns().filter(column => column.getCanHide()).map(column => (
                <DropdownItem 
                  key={column.id}
                  onClick={() => column.toggleVisibility(!column.getIsVisible())}
                  active={column.getIsVisible()}
                >
                  <Checkbox
                    id={`column-${column.id}`}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>
                    {column.columnDef.header || column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                  </span>
                </DropdownItem>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Column-specific filters */}
      {showColumnFilters && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
            {columnFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500"
                onClick={() => setColumnFilters([])}
              >
                Clear all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {table.getAllColumns()
              .filter(column => column.getCanFilter() && column.getIsVisible())
              .map(column => (
                <div key={column.id} className="flex flex-col gap-1">
                  <label htmlFor={`filter-${column.id}`} className="text-xs font-medium text-gray-500">
                    {column.columnDef.header || column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                  </label>
                  <div className="relative">
                    <Input
                      id={`filter-${column.id}`}
                      placeholder={`Filter...`}
                      value={column.getFilterValue() || ""}
                      onChange={(e) => column.setFilterValue(e.target.value)}
                      className="h-8 text-sm"
                    />
                    {column.getFilterValue() && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                        onClick={() => column.setFilterValue("")}
                        icon={<X className="h-3 w-3" />}
                      />
                    )}
                  </div>
                </div>
              ))}
            {table.getAllColumns().filter(column => column.getCanFilter() && column.getIsVisible()).length === 0 && (
              <div className="col-span-full text-center text-sm text-gray-500">
                No filterable columns are currently visible.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {columnFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {columnFilters.map((filter, index) => {
            const column = table.getColumn(filter.id);
            if (!column) return null;
            
            return (
              <Badge key={index} variant="blue">
                <span className="mr-1 font-normal text-blue-600">
                  {column.columnDef.header || filter.id}:
                </span>
                {filter.value.toString()}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 p-0 text-blue-600 hover:text-blue-800"
                  onClick={() => column.setFilterValue("")}
                  icon={<X className="h-3 w-3" />}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-auto max-h-[500px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50 hover:bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center ${
                          header.column.getCanSort() ? "cursor-pointer select-none" : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <span className="ml-1 flex w-4">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : header.column.getCanSort() ? (
                            <div className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100" />
                          ) : null}
                        </span>
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-1 text-gray-500">
                    <Search className="h-8 w-8 opacity-20" />
                    <p className="text-sm">No results found</p>
                    {globalFilter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 text-xs"
                        onClick={() => setGlobalFilter("")}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table footer with pagination/status */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-500">
        <div>
          Showing {table.getRowModel().rows.length} of {data.length} rows
        </div>
        <div>
          {visibleColumnsCount} of {totalColumnsCount} columns visible
        </div>
      </div>
    </div>
  );
};

export default DataTable;