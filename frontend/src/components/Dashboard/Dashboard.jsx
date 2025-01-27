import React, { useEffect, useState } from 'react';
import style from './Dashboard.module.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [dashborardLinks, setDashborardLinks] = useState([])
  const [linkId, setLinkId] = useState(null)

  // console.log(linkId)
  useEffect(() => {
    DashboardUrl();
  }, [])

  // fecthing the url from the backend  
  const DashboardUrl = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/url", {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      console.log(response.data)
      setDashborardLinks(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  // updating the url to the backend

  // deleting the url 

  const deleteUrl = async(id) =>{
    setLinkId(id)
    console.log(id)
   try {
        await axios.delete(`http://localhost:4000/api/url/deleteLink/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
       // Remove deleted folder from the list
       const updatedFolder = dashborardLinks.filter((url) => url._id !== id)
       setDashborardLinks(updatedFolder);// Update the state
      //  setConfirmDeleteModel(false);
       toast.success("Url deleted successfully");
    }
     catch (error) {
      console.error("Error deleting Url:", error);
      toast.error("Error deleting Url");
    }
  }

  // const handleDelete = (id) =>{
  //   console.log(id)

  // }


  return (

    <div className={style.tableContainer}>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Remarks</th>
            <th>Clicks</th>
            <th>status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {dashborardLinks.map((item, index) => (
            <tr key={index}>

             <td>{new Date(item.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
              </td>
              <td className={style.data}>{item.destinationUrl}</td>
              <td>{item.shortUrl}</td>
              <td>{item.remarks}</td>
              <td>{item.clickCount}</td>
              
              <td className={item.createdAt !== item.expiryDate ? style.status : style.inactive}>{item.status}</td>
              <td>edit || <button onClick={()=>deleteUrl(item._id)}>del</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}

export default Dashboard;
