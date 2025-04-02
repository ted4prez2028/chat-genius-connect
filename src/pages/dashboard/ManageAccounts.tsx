
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getAccounts, 
  createAccount, 
  updateAccount, 
  deleteAccount, 
  suspendAccount, 
  activateAccount,
  Account,
  AccountRole
} from "@/services/accountsService";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  PlusCircle, 
  MoreVertical, 
  UserPlus, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  Search,
  RefreshCw,
  Users, 
  UserCog, 
  Store 
} from "lucide-react";
import { format } from "date-fns";

const ManageAccounts = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<AccountRole | "all">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    role: "customer" as AccountRole,
    status: "active" as Account["status"],
  });

  const { 
    data: accounts = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  // Filter accounts based on search term and role filter
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || account.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Account stats
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(account => account.status === "active").length;
  const suspendedAccounts = accounts.filter(account => account.status === "suspended").length;
  const pendingAccounts = accounts.filter(account => account.status === "pending").length;
  
  const adminCount = accounts.filter(account => account.role === "admin").length;
  const vendorCount = accounts.filter(account => account.role === "vendor").length;
  const customerCount = accounts.filter(account => account.role === "customer").length;

  const handleCreateAccount = async () => {
    try {
      if (!newAccount.name || !newAccount.email) {
        toast.error("Name and email are required");
        return;
      }
      
      await createAccount(newAccount);
      setNewAccount({
        name: "",
        email: "",
        role: "customer",
        status: "active",
      });
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      if (!selectedAccount) return;
      
      await updateAccount(selectedAccount.id, selectedAccount);
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update account");
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!selectedAccount) return;
      
      await deleteAccount(selectedAccount.id);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to delete account");
      console.error(error);
    }
  };

  const handleSuspendAccount = async (account: Account) => {
    try {
      await suspendAccount(account.id);
      refetch();
    } catch (error) {
      toast.error("Failed to suspend account");
      console.error(error);
    }
  };

  const handleActivateAccount = async (account: Account) => {
    try {
      await activateAccount(account.id);
      refetch();
    } catch (error) {
      toast.error("Failed to activate account");
      console.error(error);
    }
  };

  const getStatusBadgeClass = (status: Account["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBadgeClass = (role: AccountRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "vendor":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: AccountRole) => {
    switch (role) {
      case "admin":
        return <UserCog className="h-4 w-4" />;
      case "vendor":
        return <Store className="h-4 w-4" />;
      case "customer":
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500">Error loading accounts: {String(error)}</div>
        <Button onClick={() => refetch()} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">MANAGE ACCOUNTS</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalAccounts}</div>
            <div className="mt-2 flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {activeAccounts} Active
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {suspendedAccounts} Suspended
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {pendingAccounts} Pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{adminCount}</div>
            <div className="text-sm text-gray-500 mt-2">System administrators</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{vendorCount}</div>
            <div className="text-sm text-gray-500 mt-2">Food truck owners</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{customerCount}</div>
            <div className="text-sm text-gray-500 mt-2">Platform users</div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Accounts</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Account
            </Button>
          </div>
          <CardDescription>
            Manage user accounts across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accounts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <Select
                value={filterRole}
                onValueChange={(value) => setFilterRole(value as AccountRole | "all")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="vendor">Vendors</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                      </div>
                      <div className="mt-2 text-gray-500">Loading accounts...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">No accounts found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={account.avatar} />
                            <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{account.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(account.role)}`}>
                          {getRoleIcon(account.role)}
                          <span className="ml-1 capitalize">{account.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(account.status)}`}>
                          {account.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {account.status === "suspended" && <Ban className="h-3 w-3 mr-1" />}
                          {account.status === "pending" && <RefreshCw className="h-3 w-3 mr-1" />}
                          <span className="capitalize">{account.status}</span>
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(account.dateCreated), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {account.lastLogin 
                          ? format(new Date(account.lastLogin), 'MMM d, yyyy') 
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAccount(account);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            
                            {account.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() => handleSuspendAccount(account)}
                                className="text-red-600"
                              >
                                <Ban className="h-4 w-4 mr-2" /> Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleActivateAccount(account)}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" /> Activate
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAccount(account);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Account Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Add a new user account to the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={newAccount.name}
                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                placeholder="Enter name"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={newAccount.email}
                onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="role">Role</label>
              <Select
                value={newAccount.role}
                onValueChange={(value) => setNewAccount({...newAccount, role: value as AccountRole})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="status">Status</label>
              <Select
                value={newAccount.status}
                onValueChange={(value) => setNewAccount({...newAccount, status: value as Account["status"]})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAccount}>
              <UserPlus className="h-4 w-4 mr-2" /> Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update account information
            </DialogDescription>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name">Name</label>
                <Input
                  id="edit-name"
                  value={selectedAccount.name}
                  onChange={(e) => setSelectedAccount({...selectedAccount, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-email">Email</label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedAccount.email}
                  onChange={(e) => setSelectedAccount({...selectedAccount, email: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-role">Role</label>
                <Select
                  value={selectedAccount.role}
                  onValueChange={(value) => setSelectedAccount({...selectedAccount, role: value as AccountRole})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-status">Status</label>
                <Select
                  value={selectedAccount.status}
                  onValueChange={(value) => setSelectedAccount({...selectedAccount, status: value as Account["status"]})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAccount}>
              <Edit className="h-4 w-4 mr-2" /> Update Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="py-4 flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={selectedAccount.avatar} />
                <AvatarFallback>{selectedAccount.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedAccount.name}</div>
                <div className="text-sm text-gray-500">{selectedAccount.email}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageAccounts;
