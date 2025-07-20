import * as XLSX from 'xlsx';

// This function will be imported into your TransactionTable component
export const downloadToExcel = (data: any[], fileName: string) => {
  // 1. Convert your array of objects into a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // 2. Create a new workbook
  const workbook = XLSX.utils.book_new();

  // 3. Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // 4. Set column widths for better readability (optional)
  worksheet["!cols"] = [
    { wch: 20 }, // Date
    { wch: 40 }, // Description
    { wch: 15 }, // Type
    { wch: 25 }, // Category ID
    { wch: 15 }, // Amount
  ];

  // 5. Trigger the download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};