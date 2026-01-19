import NotFound from "./Components/NotFound";
import HomePageadmin from "./Pages/Admin/HomePage";
import { CategoryTable } from "./Pages/Admin/Category";
import ProductsPage from "./Pages/ProductsPage";
import AddCategory from "./Pages/Admin/AddCategory";
import BusinessListPage from "./Pages/Admin/Business";
import AddBusiness from "./Pages/Admin/BusinessAdd";
import UpdateBusiness from "./Pages/Admin/UpdateBusiness";
import UserList from "./Pages/Admin/Userlist";
import Banner from "./Pages/Admin/Banner";
import SubCategoryList from "./Pages/Admin/SubCategory/SubCategoryList";
import AddSubCategory from "./Pages/Admin/SubCategory/AddSubCategory";

const AdminRoutes = [
  {
    path: "/admin/home",
    name: "Home",
    component: HomePageadmin,
  },
  {
    path: "/products",
    name: "Products",
    component: ProductsPage,
  },
  {
    path: "/admin/category-list",
    name: "Category",
    component: CategoryTable,
  },
  {
    path: "/admin/categorys/add",
    name: "Add Category",
    component: AddCategory
  },
  {
    path: "/admin/subcategory-list",
    name: "Sub Category",
    component: SubCategoryList,
  },
  {
    path: "/admin/subcategory-add",
    name: "Add Sub Category",
    component: AddSubCategory
  },
  {
    path: "/admin/business-list",
    name: "Business List",
    component: BusinessListPage
  },
  {
    path: "/admin/business-list/add",
    name: "Add Business",
    component: AddBusiness
  },
  {
    path: "/admin/business-list/update/:id",
    name: "Update Business",
    component: UpdateBusiness
  },

  {
    path: "/admin/user-list",
    name: "User List",
    component: UserList,
  },

  {
    path: "/admin/banner",
    name: "Banner List",
    component: Banner,
  },

  { path: "*", name: 'Not Found', component: NotFound },
];

export { AdminRoutes };
