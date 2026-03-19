// app/stores/page.tsx
"use client"

import * as React from "react"
import * as XLSX from "xlsx"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Icons
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Upload,
  Search,
  FileSpreadsheet,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Filter,
  Eye,
  EyeOff,
  Columns,
  Copy,
  Check,
  AlertCircle,
  Trash2,
  MoreHorizontal,
  FilterX,
  SortAsc,
  SortDesc,
  Database,
  Star,
  StarOff,
  Pin,
  PinOff,
  RefreshCw,
  FileDown,
} from "lucide-react"

type RowData = {
  [key: string]: any
}

export default function StoresPage() {
  const [data, setData] = React.useState<RowData[]>([])
  const [columns, setColumns] = React.useState<ColumnDef<RowData>[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [fileName, setFileName] = React.useState<string>("")
  const [rowCount, setRowCount] = React.useState<number>(0)
  const [columnCount, setColumnCount] = React.useState<number>(0)
  const [sheetNames, setSheetNames] = React.useState<string[]>([])
  const [currentSheet, setCurrentSheet] = React.useState<string>("")
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(new Set())
  const [favoriteColumns, setFavoriteColumns] = React.useState<Set<string>>(new Set())
  const [pinnedColumns, setPinnedColumns] = React.useState<Set<string>>(new Set())
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = React.useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()

    reader.onload = (evt) => {
      const binaryStr = evt.target?.result
      const workbook = XLSX.read(binaryStr, { type: "binary" })
      
      const sheets = workbook.SheetNames
      setSheetNames(sheets)
      setCurrentSheet(sheets[0])
      
      const worksheet = workbook.Sheets[sheets[0]]
      const jsonData = XLSX.utils.sheet_to_json<RowData>(worksheet)

      if (!jsonData.length) return

      setData(jsonData)
      setRowCount(jsonData.length)
      setColumnCount(Object.keys(jsonData[0]).length)

      // Create columns with rich features
      const cols: ColumnDef<RowData>[] = Object.keys(jsonData[0]).map((key) => ({
        accessorKey: key,
        header: ({ column }) => {
          const isFavorite = favoriteColumns.has(key)
          const isPinned = pinnedColumns.has(key)
          
          return (
            <div className="flex items-center gap-1 group">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 font-medium"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                <span className="truncate max-w-[120px]">{key}</span>
                {column.getIsSorted() === "asc" ? (
                  <SortAsc className="ml-1 h-3 w-3" />
                ) : column.getIsSorted() === "desc" ? (
                  <SortDesc className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowUpDown className="ml-1 h-3 w-3 opacity-50 group-hover:opacity-100" />
                )}
              </Button>
              
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setFavoriteColumns(prev => {
                          const newSet = new Set(prev)
                          if (newSet.has(key)) newSet.delete(key)
                          else newSet.add(key)
                          return newSet
                        })
                      }}
                    >
                      <Star className={`h-3 w-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setPinnedColumns(prev => {
                          const newSet = new Set(prev)
                          if (newSet.has(key)) newSet.delete(key)
                          else newSet.add(key)
                          return newSet
                        })
                      }}
                    >
                      <Pin className={`h-3 w-3 ${isPinned ? 'fill-primary text-primary rotate-45' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{isPinned ? 'Unpin column' : 'Pin column'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setHiddenColumns(prev => {
                          const newSet = new Set(prev)
                          newSet.add(key)
                          return newSet
                        })
                      }}
                    >
                      <EyeOff className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Hide column</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )
        },
        cell: ({ row }) => {
          const value = row.getValue(key)
          const cellId = `${row.id}-${key}`
          const [copied, setCopied] = React.useState(false)

          if (value === null || value === undefined) {
            return <span className="text-muted-foreground italic text-sm">—</span>
          }

          const handleCopy = () => {
            navigator.clipboard.writeText(String(value))
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }

          const isNumber = typeof value === 'number'
          
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={handleCopy}
                  className={`cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors group relative ${
                    isNumber ? 'text-right font-mono' : ''
                  }`}
                >
                  <span className="text-sm">
                    {isNumber ? value.toLocaleString() : String(value)}
                  </span>
                  {copied && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>Click to copy</p>
                <p className="text-muted-foreground mt-1">{String(value).length} characters</p>
              </TooltipContent>
            </Tooltip>
          )
        },
      }))

      setColumns(cols)
    }

    reader.readAsBinaryString(file)
  }

  const loadSheet = (sheetName: string) => {
    if (!fileName) return
    
    const file = (document.getElementById("file-upload") as HTMLInputElement)?.files?.[0]
    if (!file) return

    setCurrentSheet(sheetName)
    const reader = new FileReader()

    reader.onload = (evt) => {
      const binaryStr = evt.target?.result
      const workbook = XLSX.read(binaryStr, { type: "binary" })
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json<RowData>(worksheet)

      if (!jsonData.length) return

      setData(jsonData)
      setRowCount(jsonData.length)
      setColumnCount(Object.keys(jsonData[0]).length)
    }

    reader.readAsBinaryString(file)
  }

  const handleExport = () => {
    if (data.length === 0) return
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, currentSheet || "Sheet1")
    XLSX.writeFile(wb, `export_${fileName || "data"}.xlsx`)
  }

  const clearData = () => {
    setData([])
    setColumns([])
    setFileName("")
    setRowCount(0)
    setColumnCount(0)
    setGlobalFilter("")
    setSheetNames([])
    setCurrentSheet("")
    setHiddenColumns(new Set())
    setFavoriteColumns(new Set())
    setPinnedColumns(new Set())
    setSelectedRows(new Set())
    
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) newSet.delete(rowId)
      else newSet.add(rowId)
      return newSet
    })
  }

  const selectAllRows = () => {
    if (selectedRows.size === table.getRowModel().rows.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(table.getRowModel().rows.map(row => row.id)))
    }
  }

  const deleteSelectedRows = () => {
    const newData = data.filter((_, index) => !selectedRows.has(`row-${index}`))
    setData(newData)
    setSelectedRows(new Set())
  }

  // Filter columns based on visibility and sorting
  const visibleColumns = React.useMemo(() => {
    // First show pinned columns, then favorites, then others
    const allColumns = columns.filter(col => !hiddenColumns.has(col.accessorKey as string))
    
    return allColumns.sort((a, b) => {
      const aKey = a.accessorKey as string
      const bKey = b.accessorKey as string
      
      // Pinned columns come first
      if (pinnedColumns.has(aKey) && !pinnedColumns.has(bKey)) return -1
      if (!pinnedColumns.has(aKey) && pinnedColumns.has(bKey)) return 1
      
      // Then favorites
      if (favoriteColumns.has(aKey) && !favoriteColumns.has(bKey)) return -1
      if (!favoriteColumns.has(aKey) && favoriteColumns.has(bKey)) return 1
      
      return 0
    })
  }, [columns, hiddenColumns, pinnedColumns, favoriteColumns])

  const table = useReactTable({
    data,
    columns: visibleColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Data Explorer</h1>
                <p className="text-xs text-muted-foreground">Upload, filter, and explore your data</p>
              </div>
            </div>
            
            {data.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {selectedRows.size > 0 && (
                  <Button variant="destructive" size="sm" onClick={deleteSelectedRows}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedRows.size})
                  </Button>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Upload Card */}
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Upload your data</h3>
                  <p className="text-sm text-muted-foreground">Excel (.xlsx, .xls) or CSV files</p>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button className="w-full sm:w-auto">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
              
              {fileName && (
                <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t">
                  <Badge variant="secondary" className="px-3 py-1">
                    📄 {fileName}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    📊 {rowCount.toLocaleString()} rows
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    📋 {columnCount} columns
                  </Badge>
                  {sheetNames.length > 1 && (
                    <Badge variant="outline" className="px-3 py-1">
                      📑 {sheetNames.length} sheets
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={clearData}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {data.length > 0 && (
            <>
              {/* Sheet Selector */}
              {sheetNames.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {sheetNames.map((sheet) => (
                    <Button
                      key={sheet}
                      variant={currentSheet === sheet ? "default" : "outline"}
                      size="sm"
                      onClick={() => loadSheet(sheet)}
                      className="whitespace-nowrap"
                    >
                      {sheet}
                    </Button>
                  ))}
                </div>
              )}

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex-1 min-w-[250px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search across all columns..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-9"
                  />
                  {globalFilter && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setGlobalFilter("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Filter Toggle */}
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {columnFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                      {columnFilters.length}
                    </Badge>
                  )}
                </Button>

                {/* Rows per page */}
                <Select
                  value={String(table.getState().pagination.pageSize)}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50, 100].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Column Stats */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Separator orientation="vertical" className="h-4" />
                  <span>{visibleColumns.length} of {columns.length} columns</span>
                  {favoriteColumns.size > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span>{favoriteColumns.size} favorites</span>
                    </>
                  )}
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <Card>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Column Filters</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setColumnFilters([])}
                      >
                        <FilterX className="h-3 w-3 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {visibleColumns.slice(0, 9).map((col) => {
                        const key = col.accessorKey as string
                        return (
                          <div key={key} className="space-y-1">
                            <Label className="text-xs flex items-center gap-1">
                              {favoriteColumns.has(key) && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              )}
                              {key}
                            </Label>
                            <Input
                              placeholder={`Filter ${key}...`}
                              className="h-8 text-xs"
                              value={(columnFilters.find(f => f.id === key)?.value as string) || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                setColumnFilters(prev => {
                                  const existing = prev.find(f => f.id === key)
                                  if (existing) {
                                    return prev.map(f => f.id === key ? { ...f, value } : f)
                                  }
                                  return [...prev, { id: key, value }]
                                })
                              }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>
                  <span className="text-muted-foreground">results</span>
                  {selectedRows.size > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="font-medium">{selectedRows.size}</span>
                      <span className="text-muted-foreground">selected</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllRows}>
                    {selectedRows.size === table.getRowModel().rows.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>

              {/* Main Table */}
              <Card className="border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          <TableHead className="w-10">
                            <Checkbox
                              checked={selectedRows.size === table.getRowModel().rows.length}
                              onCheckedChange={selectAllRows}
                            />
                          </TableHead>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="whitespace-nowrap">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            className={`hover:bg-muted/50 transition-colors ${
                              selectedRows.has(row.id) ? 'bg-primary/5' : ''
                            }`}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedRows.has(row.id)}
                                onCheckedChange={() => toggleRowSelection(row.id)}
                              />
                            </TableCell>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={visibleColumns.length + 1} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Search className="h-8 w-8 mb-2" />
                              <p>No results found</p>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => {
                                  setGlobalFilter("")
                                  setColumnFilters([])
                                }}
                              >
                                Clear filters
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="border-t px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                        let pageNum = i + 1
                        const currentPage = table.getState().pagination.pageIndex + 1
                        
                        if (table.getPageCount() > 5) {
                          if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= table.getPageCount() - 2) {
                            pageNum = table.getPageCount() - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8"
                            onClick={() => table.setPageIndex(pageNum - 1)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick Stats Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Total Rows</div>
                    <div className="text-lg font-semibold">{rowCount.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Total Columns</div>
                    <div className="text-lg font-semibold">{columnCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Favorites</div>
                    <div className="text-lg font-semibold">{favoriteColumns.size}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Pinned</div>
                    <div className="text-lg font-semibold">{pinnedColumns.size}</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Empty State */}
          {data.length === 0 && (
            <Card className="border shadow-sm">
              <CardContent className="py-16">
                <div className="text-center max-w-sm mx-auto">
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <FileSpreadsheet className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">No data loaded</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Upload an Excel or CSV file to start exploring your data
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✓ Search across all columns</p>
                    <p>✓ Filter individual columns</p>
                    <p>✓ Sort by any column</p>
                    <p>✓ Favorite and pin important columns</p>
                    <p>✓ Export filtered data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </TooltipProvider>
  )
}