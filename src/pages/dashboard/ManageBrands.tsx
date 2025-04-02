
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Grid, Trash2, Edit, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";

type Brand = {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  established: string;
  active: boolean;
};

const ManageBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: "1",
      name: "Food Truck Fiesta",
      description: "Authentic Mexican cuisine on wheels, serving tacos, burritos, and more.",
      logo: "https://placehold.co/400x200?text=Food+Truck+Fiesta",
      website: "https://example.com/foodtruckfiesta",
      established: "2018",
      active: true,
    },
    {
      id: "2",
      name: "Burger Wheels",
      description: "Gourmet burgers made with locally-sourced ingredients.",
      logo: "https://placehold.co/400x200?text=Burger+Wheels",
      website: "https://example.com/burgerwheels",
      established: "2020",
      active: true,
    },
    {
      id: "3",
      name: "Sweet Street",
      description: "Desserts and sweet treats for all occasions.",
      logo: "https://placehold.co/400x200?text=Sweet+Street",
      website: "https://example.com/sweetstreet",
      established: "2019",
      active: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newBrand, setNewBrand] = useState<Omit<Brand, "id" | "active">>({
    name: "",
    description: "",
    logo: "",
    website: "",
    established: "",
  });
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBrand = () => {
    const id = Math.random().toString(36).substring(2, 9);
    setBrands([...brands, { ...newBrand, id, active: true }]);
    setNewBrand({
      name: "",
      description: "",
      logo: "",
      website: "",
      established: "",
    });
    setIsDialogOpen(false);
    toast.success("Brand added successfully!");
  };

  const handleUpdateBrand = () => {
    if (!editBrand) return;
    
    setBrands(brands.map(brand => 
      brand.id === editBrand.id ? editBrand : brand
    ));
    setEditBrand(null);
    setIsDialogOpen(false);
    toast.success("Brand updated successfully!");
  };

  const handleDeleteBrand = (id: string) => {
    setBrands(brands.filter(brand => brand.id !== id));
    toast.success("Brand deleted successfully!");
  };

  const handleToggleStatus = (id: string) => {
    setBrands(brands.map(brand => 
      brand.id === id ? { ...brand, active: !brand.active } : brand
    ));
    toast.success("Brand status updated!");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">MANAGE BRANDS</h1>
          <p className="text-muted-foreground mt-2">Manage your food truck brands and vendors</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search brands..."
              className="pl-8 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle size={18} />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editBrand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
                <DialogDescription>
                  {editBrand 
                    ? "Update the brand information below."
                    : "Fill in the details to add a new food truck brand."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Brand Name</Label>
                  <Input
                    id="name"
                    value={editBrand ? editBrand.name : newBrand.name}
                    onChange={(e) => {
                      if (editBrand) {
                        setEditBrand({ ...editBrand, name: e.target.value });
                      } else {
                        setNewBrand({ ...newBrand, name: e.target.value });
                      }
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editBrand ? editBrand.description : newBrand.description}
                    onChange={(e) => {
                      if (editBrand) {
                        setEditBrand({ ...editBrand, description: e.target.value });
                      } else {
                        setNewBrand({ ...newBrand, description: e.target.value });
                      }
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={editBrand ? editBrand.logo : newBrand.logo}
                    onChange={(e) => {
                      if (editBrand) {
                        setEditBrand({ ...editBrand, logo: e.target.value });
                      } else {
                        setNewBrand({ ...newBrand, logo: e.target.value });
                      }
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editBrand ? editBrand.website : newBrand.website}
                    onChange={(e) => {
                      if (editBrand) {
                        setEditBrand({ ...editBrand, website: e.target.value });
                      } else {
                        setNewBrand({ ...newBrand, website: e.target.value });
                      }
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="established">Year Established</Label>
                  <Input
                    id="established"
                    value={editBrand ? editBrand.established : newBrand.established}
                    onChange={(e) => {
                      if (editBrand) {
                        setEditBrand({ ...editBrand, established: e.target.value });
                      } else {
                        setNewBrand({ ...newBrand, established: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setEditBrand(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={editBrand ? handleUpdateBrand : handleAddBrand}
                  disabled={editBrand 
                    ? !editBrand.name || !editBrand.description
                    : !newBrand.name || !newBrand.description
                  }
                >
                  {editBrand ? "Update Brand" : "Add Brand"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <Card key={brand.id} className={brand.active ? "" : "opacity-70"}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {brand.name} 
                    <span className={`text-xs px-2 py-0.5 rounded-full ${brand.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {brand.active ? "Active" : "Inactive"}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Est. {brand.established}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      setEditBrand(brand);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700" 
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 mb-2">{brand.description}</p>
              <a 
                href={brand.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:underline"
              >
                {brand.website}
              </a>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleToggleStatus(brand.id)}
              >
                {brand.active ? "Deactivate Brand" : "Activate Brand"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <Grid className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No brands found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? "Try a different search term or" : "Get started by"} adding a new brand.
          </p>
          <Button 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setIsDialogOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManageBrands;
