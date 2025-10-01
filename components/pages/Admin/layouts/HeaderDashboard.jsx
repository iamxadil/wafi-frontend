import React from "react";
import { FaSearch, FaBoxOpen, FaUserAlt } from "react-icons/fa";
import { RiEdit2Line as Edit, RiApps2AddLine as Add, RiDeleteBin5Line  as Delete } from "react-icons/ri";
import useAuthStore from '../../../stores/useAuthStore.jsx';
import '../styles/headerdashboard.css';


const HeaderDashboard = ({ 
   page,   
   addText = "+ Add Item",
   deleteText = "- Delete Item",
   editText = " Edit Item",
   stats = [], filterOptions = [], brandOptions =[],
   sortOptions = [],
   onAdd = () => {},
   onDelete = () => {},
   onEdit = () => {},
   onSearch = () => {},
   onSort = () => {},
   onCategory = () => {},
   onBrand = () => {},
   onRole= () => {},
}) => {

 
const {user} = useAuthStore();
 



  return (

    <>
    <div className="pc-version">

    
    <header className="adm-header">
      {/* Left: Search */}
      <div className="adm-left">
        <div className="adm-search">
          <FaSearch className="adm-search-icon" />
          <input type="search" placeholder="Search..." onChange={(e) => onSearch(e.target.value) }/>
        </div>
      </div>

      {/* Center: Filter + Sort + Stats */}
      <div className="adm-center">

         {page === "products" && 
        <select className="adm-brand" onChange={(e) => onBrand(e.target.value)}>
         {brandOptions.map(opt => <option key={opt.value}value={opt.value}>{opt.label}</option>)}
        </select>}

        {filterOptions.length > 0 ? <select className="adm-filter" onChange={(e) => onCategory(e.target.value)}>
          {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select> : ""}

          {sortOptions.length > 0 ? <select className="adm-sort" onChange={(e) => onSort(e.target.value)}>
          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>) }
          </select> : "" }
          
        {
          page === "users" && 
             <select className="adm-filter-roles" onChange={(e) => onRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="admin">Admins</option>
              <option value="moderator">Moderators</option>
              <option value="user">Users</option>
             </select>
        }


        <div className="adm-stats">
          {stats.length > 0
            ? stats.map((stat, i) => (
                <div key={i} className="stat">
                  {stat.icon} <span>{stat.label}: {stat.value}</span>
                </div>
              ))
            : <div className="stat"><FaBoxOpen /> <span>Total: 0</span></div>
          }
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="adm-right">

        {(page === "approvals" || (page === "notifications") || (page === "users" && user?.role === "moderator")) || (page === "order-status") 
            ? null 
            : <button onClick={onAdd}><Add />{addText}</button> 
        }
        {(page === "approvals") || (page === "order-status") ? "" :  <button onClick={onEdit}><Edit />{editText}</button>}
        {(page === "approvals") || (page === "order-status") ? "": <button onClick={onDelete}><Delete />{deleteText}</button>}
      </div>
    </header>
    </div>


    <div className="mob-version">
      <header className="mob-adm-header">

          <div className="mob-adm-top">

          <div className="mob-adm-search">
            <FaSearch className="adm-search-icon" />
            <input type="search" placeholder="Search..." onChange={(e) => onSearch(e.target.value) }/>
          </div>
          
           <div className="mob-adm-stats">
          {stats.length > 0
            ? stats.map((stat, i) => (
                <div key={i} className="stat">
                  {stat.icon} <span>{stat.label}: {stat.value}</span>
                </div>
              ))
            : <div className="stat"><FaBoxOpen /> <span>Total: 0</span></div>
          }
        </div>

          </div>

        <div className="mob-adm-center">

        {page === "products" && 
        <select className="adm-brand" onChange={(e) => onBrand(e.target.value)}>
         {brandOptions.map(opt => <option key={opt.value}value={opt.value}>{opt.label}</option>)}
        </select>}
         

       {filterOptions.length > 0 ? <select className="adm-filter" onChange={(e) => onCategory(e.target.value)}>
          {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select> : ""}

      

        {sortOptions.length > 0 ? <select className="adm-sort" onChange={(e) => onCategory(e.target.value)}>
          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select> : ""}



         {
          page === "users" && 
             <select className="adm-filter-roles" onChange={(e) => onRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="admin">Admins</option>
              <option value="moderator">Moderators</option>
              <option value="user">Users</option>
             </select>
        }
        </div>  


        <div className="mob-adm-bottom">
          {(page === "approvals" || (page === "users" && user?.role === "moderator")) || (page === "order-status") ? null : <button onClick={onAdd}><Add />{addText}</button>}
          {(page === "approvals") || (page === "order-status") ? null :  <button onClick={onEdit}><Edit />{editText}</button>}
          {(page === "approvals" || (page === "users" && user?.role === "moderator")) || (page === "order-status") ? null : <button onClick={onDelete}><Delete />{deleteText}</button>}
        </div>
      
      </header>
    </div>

    </>
  );
};

export default HeaderDashboard;
