import React, { useEffect, useState } from 'react';
import style from './Linkpage.module.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const Linkpage = () => {

  const [linkpageLinks, setLinkpageLinks] = useState([])
  // const [linkId, setLinkId] = useState(null)

  // console.log(linkId)
  useEffect(() => {
    LinkUrl();
  }, [])

  // fecthing the url from the backend  
  const LinkUrl = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/url", {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      }); 
      console.log(response.data)
      setLinkpageLinks(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  // updating the url to the backend

  // deleting the url 
  const deleteUrl = async (id) => {
    // setLinkId(id)
    console.log(id)
    try {
      await axios.delete(`http://localhost:4000/api/url/deleteLink/${id}`,
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
      // Remove deleted folder from the list
      const updatedDashboardLink = linkpageLinks.filter((url) => url._id !== id)
      setLinkpageLinks(updatedDashboardLink);// Update the state
      //  setConfirmDeleteModel(false);
      toast.success("Url deleted successfully");
    }
    catch (error) {
      console.error("Error deleting Url:", error);
      toast.error("Error deleting Url");
    }
  };

  return (
    <>
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
            {linkpageLinks.map((item, index) => (
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
                <td>edit || <button onClick={() => deleteUrl(item._id)}>del</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
};

export default Linkpage
