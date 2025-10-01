import React, { useEffect } from 'react'
import '../styles/notifications.css';
import { 
  RiNotificationOffLine as Notify,
  RiUserReceivedLine as NewUser,
  RiEdit2Line as UpdatedProduct,
  RiDeleteBinLine as Delete
} from "react-icons/ri";
import { toast } from "react-toastify";
import useNotsStore from '../../../stores/useNotsStore';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";  

const Notifications = () => {
  const fetchNotifications = useNotsStore((state) => state.fetchNotifications);
  const loading = useNotsStore((state) => state.loading);
  const notifications = useNotsStore((state) => state.notifications);
  const deleteNotificationById = useNotsStore((state) => state.deleteNotificationById);
  const deleteNotifications = useNotsStore(state => state.deleteNotifications);
  const navigate = useNavigate();  

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  dayjs.extend(relativeTime);

  const iconMap = {
    "New User": <NewUser />,
    "Product Updated": <UpdatedProduct />,
    "default": <Notify />,
  };

const handleDeleteAll = () => {

   if(notifications.length <= 0){
    toast.warning("No notifications !");
    return;
  }

  const confirmed = window.confirm("Are you sure you want to delete ALL notifications?");

  if (confirmed) {
    deleteNotifications(); // call the store function to delete all
    toast.success("Notifications Deleted Successfully")
  }
};

const handleNavigate = (type) => {
  switch (type) {
    case 'New User':
      navigate('/admin-dashboard/users');
      break;
    case 'Product Updated':
      navigate('/admin-dashboard/products');
      break;
    case 'product-created':
      navigate("/admin-dashboard/approvals")
      break;

    default:
      navigate('/admin-dashboard');
      break;
  }
};

  return (
    <main id='notifications'>
      <header id='notifications-counter'>
        <div>
          <h1>
            Notifications <span>{loading ? "..." : notifications?.length ?? 0}</span>
          </h1>
        </div>
        <button id='en-dis' onClick={handleDeleteAll}>Delete All Notifications <Delete /></button>
      </header>

      {notifications && notifications.length > 0 ? (
        notifications.map((not) => (
          <div className="not-card" key={not._id}>
            <div className="not-info">

              <div className="info-circle">
                {iconMap[not.type] || iconMap["default"]}
              </div>
              
              <h1>Notification</h1>
              <div>
                <span>{not.type}</span> • <p>{dayjs(not.date).fromNow()}</p>
              </div>

              <div className="not-description">
                <p>{not.message}</p>
              </div>
            </div>

            <div className="not-actions">
             <button onClick={() => handleNavigate(not.type)}>Go to Page </button>
            <button onClick={() => deleteNotificationById(not._id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-notifications" style={{marginLeft: "4px"}}>No notifications found</p>
      )}
    </main>
  );
};

export default Notifications;
