"use client";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown, ChevronUp, MoreHorizontal, Trash, Search,
  X, ChevronLeft, ChevronRight, RefreshCw, Clock, Download,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { downloadToExcel } from "@/app/lib/exportUtils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/accounts";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "date", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];


// In your useMemo:
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();

        result = result.filter((transaction) => {
          // description match
          const inDescription = transaction.description?.toLowerCase().includes(searchLower);

          // Try to parse the search string as a date
          let inDate = false;
          try {
            // Try some common formats
            const transactionDate = new Date(transaction.date);
            // Format the transaction date in multiple user-friendly ways
            const dateFormats = [
              "PPP",       // "Jul 20, 2024"
              "dd MMM",    // "20 Jul"
              "d MMM",     // "5 Aug"
              "MMMM d",    // "July 20"
              "d MMMM",    // "20 July"
              "yyyy-MM-dd" // "2024-07-20"
            ];

            inDate = dateFormats.some(fmt =>
              format(transactionDate, fmt).toLowerCase().includes(searchLower)
            );

            // Also allow a "jul" or "march" input to match just the month
            if (!inDate) {
              const monthName = format(transactionDate, "LLLL").toLowerCase(); // "july"
              inDate = monthName.includes(searchLower);
            }
          } catch { /* ignore parse errors */ }

          return inDescription || inDate;
        });
      }

    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "date": comparison = new Date(a.date) - new Date(b.date); break;
        case "amount": comparison = a.amount - b.amount; break;
        case "category": comparison = a.category.localeCompare(b.category); break;
        default: comparison = 0;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length ? [] : paginatedTransactions.map((t) => t.id)
    );
  };

  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) return;
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]);
  };

  // NEW: Function to handle the export
  const handleExport = () => {
    const dataToExport = filteredAndSortedTransactions.map(t => ({
      Date: format(new Date(t.date), 'yyyy-MM-dd'),
      Description: t.description,
      Type: t.type,
      Category_ID: t.category,
      Amount: t.amount,
      Recurring: t.isRecurring ? RECURRING_INTERVALS[t.recurringInterval] : "One-time",
    }));
    toast.success("Preparing your download...");
    downloadToExcel(dataToExport, `transactions-export-${new Date().toISOString().split('T')[0]}`);
  };

  // consider sort direction as a filter too
  const isFiltered = (
    searchTerm || typeFilter || recurringFilter || selectedIds.length > 0
    || sortConfig.field !== "date" || sortConfig.direction !== "desc"
  );

  return (
    <div className="space-y-5">
      {deleteLoading && <BarLoader className="mt-4" width={"100%"} color="#8b5cf6" />}
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-gradient-to-r from-[#19162d]/85 to-[#23213d]/90 p-5 rounded-2xl border border-violet-800/30 shadow">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-violet-400/70" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-8 bg-[#19172e]/80 text-violet-100 border-none ring-0 focus:ring-2 focus:ring-cyan-200 transition"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); setCurrentPage(1); }}>
            <SelectTrigger className="w-[130px] bg-[#19172e]/90 text-violet-100 border-violet-800/50">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#23223c] border-violet-900/40 text-violet-200">
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={recurringFilter} onValueChange={(value) => { setRecurringFilter(value); setCurrentPage(1); }}>
            <SelectTrigger className="w-[130px] bg-[#19172e]/90 text-violet-100 border-violet-800/50">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent className="bg-[#23223c] border-violet-900/40 text-violet-200">
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>
          {/* Download Button Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Export data"
                className="border-violet-700/40 bg-violet-800/20 hover:bg-violet-900/40 text-violet-200"
              >
                <Download className="h-4 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                Export as Excel (.xlsx)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="ml-2">
              <Trash className="h-4 w-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}
          {isFiltered && (
            <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear filters or selection"
              className="border-violet-700/40 bg-violet-800/10 hover:bg-violet-900/30 text-violet-200"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-[#211d32]/90 via-[#18172c]/95 to-[#232044]/90 overflow-x-auto shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1f1a2d]/70">
              <TableHead className="w-[50px]"><Checkbox
                checked={
                  selectedIds.length === paginatedTransactions.length &&
                  paginatedTransactions.length > 0
                }
                onCheckedChange={handleSelectAll}
                className="bg-[#252048] border-violet-800/80"
              /></TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                <div className="flex items-center text-violet-100">
                  Date {sortConfig.field === "date" && (
                    sortConfig.direction === "asc"
                      ? <ChevronUp className="ml-1 h-4 w-4" />
                      : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-violet-100">Description</TableHead>
              <TableHead className="cursor-pointer text-violet-100" onClick={() => handleSort("category")}>
                <div className="flex items-center">
                  Category {sortConfig.field === "category" && (
                    sortConfig.direction === "asc"
                      ? <ChevronUp className="ml-1 h-4 w-4" />
                      : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right text-violet-100" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end">
                  Amount {sortConfig.field === "amount" && (
                    sortConfig.direction === "asc"
                      ? <ChevronUp className="ml-1 h-4 w-4" />
                      : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-violet-100">Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-violet-400 bg-[#25204a]/40">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {paginatedTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05, duration: 0.36, type: "spring" } }}
                    exit={{ opacity: 0, y: 8 }}
                    className="focus-within:bg-violet-900/20 transition"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(transaction.id)}
                        onCheckedChange={() => handleSelect(transaction.id)}
                        className="border-violet-700/50"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-violet-200">{format(new Date(transaction.date), "PP")}</TableCell>
                    <TableCell className="text-violet-100">{transaction.description}</TableCell>
                    <TableCell>
                      <span
                        style={{ background: categoryColors[transaction.category] }}
                        className="px-2 py-1 rounded text-white text-sm shadow-sm"
                      >
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell className={cn("text-right font-semibold", transaction.type === "EXPENSE" ? "text-pink-400" : "text-teal-300")}>
                      {transaction.type === "EXPENSE" ? "-" : "+"} {transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {transaction.isRecurring ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant="secondary"
                                className="gap-1 bg-purple-200/30 text-violet-200 hover:bg-purple-400/50 border border-violet-800/30"
                              >
                                <RefreshCw className="h-3 w-3" /> {RECURRING_INTERVALS[transaction.recurringInterval]}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <div className="font-medium">Next Date:</div>
                                <div>{format(new Date(transaction.nextRecurringDate), "PPP")}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-violet-300 border-violet-900/30">
                          <Clock className="h-3 w-3" /> One-time
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-violet-900/20 text-violet-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1f1937] border-violet-900/40 text-violet-200">
                          <DropdownMenuItem onClick={() => router.push(`/main/transaction/create?edit=${transaction.id}`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-pink-400" onClick={() => deleteFn([transaction.id])}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-violet-800/40 bg-violet-900/20 text-violet-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-violet-100 text-sm font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-violet-800/40 bg-violet-900/20 text-violet-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
