import React, { useEffect, useState, useRef } from 'react';
import style from './Linkpage.module.css'
import axios from 'axios';
import { toast } from 'react-toastify';
// import { useOutletContext } from 'react-router-dom';
import { useAppContext } from '../../components/AppContext';

import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";

const Linkpage = () => {

  const [linkpageLinks, setLinkpageLinks] = useState([])

  // usestate for date and time handle
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { showCreateForm, setShowCreateForm } = useAppContext();
  const linkRef = useRef();

  const [createUrl, setCreateUrl] = useState({
    destinationUrl: "",
    remarks: "",
  });

  const handleCreateUrl = (e) => {
    const { name, value } = e.target;
    setCreateUrl({ ...createUrl, [name]: value })
  }

  // copy url function
  const handleCopy = () => {
    navigator.clipboard.writeText(linkRef.current.textContent)
      .then(() => toast.success("Link copied successfully!")
    )
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleCreateUrlSubmit = async (e) => {
    e.preventDefault();

    console.log("kumar")
    try {
      const response = await axios.post('http://localhost:4000/api/url/createLinks',
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,
        },
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {

        toast.success("Url created successfully");
        setCreateUrl({ destinationUrl: "", remarks: "" });
      
      }


    } catch (error) {
      console.log("error in creating url:", error)
      toast.error("error in creating url");
      setShowCreateForm(false)
    }

  };

  const updateId = (item) => {
    setIsEditing(true);
    setCreateUrl({
      destinationUrl: item.destinationUrl,
      remarks: item.remarks,
      id: item._id
    })
  };

  const handleUpdateCreateUrl = async (id) => {
    // e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/api/url/updateLink/${id}`,
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,

        },
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );


      toast.success("Url updated successfully");
      toast("Url updated successfully");
      setShowCreateForm(false)
      setIsEditing(false);


    } catch (error) {
      console.log("error in updating the Url", error);
      toast.error("Error updating the Url")
    }
  };


  // Format the date and time
  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  // create new url end


  // console.log(linkId)
  useEffect(() => {
    getUrl();
    const date = Date();
    console.log(date)
  }, [])

  // fecthing the url from the backend  
  const getUrl = async () => {
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

  // function for clear the data in create url model
  const clear = () => {
    setCreateUrl({
      destinationUrl: "",
      remarks: ""
    })
  };

  // function for hiding the createurl model
  const handleHideCross = () => {
    setShowCreateForm(false)  
  };

  return (

    <div className={style.container}>
      <h1>links</h1>
      <div className={style.linksContainer}>
        <table className={style.tableContainer}>
          <thead className={style.tableHeader}>
            <tr>
              <th>Date</th>
              <th className={style.originalLink}>Original Link</th>
              <th className={style.shortLink}>Short Link</th>
              <th>Remarks</th>
              <th>Clicks</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {linkpageLinks.map((item, index) => (
              <tr key={index} className={style.tableRow}>
                <td>{new Date(item.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}</td>
                <td><div className={style.original}>{item.destinationUrl}</div></td>
                <td className={style.shortEdit}>
                  <div className={style.short} ref={linkRef}> {item.shortUrl}
                  </div>
                  <span className={style.copyIcon} onClick={handleCopy}>📋</span>
                </td>
                <td className={style.remarks}>{item.remarks}</td>
                <td className={style.clicks}>{item.clickCount}</td>
                <td className={style.status}>
                  <span className={item.status === 'Active' ? style.active : style.inactive}>
                    {item.status}
                  </span>
                </td>
                <td className={style.btns}>
                  <button className={style.editButton} onClick={() => updateId(item)}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className={style.deleteButton} onClick={() => deleteUrl(item._id)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* create nre url model */}
      <div className={style.createLinkModel}>
        {isEditing ? (
          <div className={style.Createlinks_container}>
            <div className={style.createLinkhead}>
              <span className={style.newSpan}>New Link</span>
              <span className={style.crossSpan} onClick={handleHideCross}>X</span>
            </div>
            {/* <div className={style.create_form}> */}
            <form onSubmit={() => handleUpdateCreateUrl(createUrl.id)} className={style.create_form}>
              <div className={style.Urlinput}>
                <label htmlFor="destinationurl">Destination Url <span>*</span></label>
                <input type="text" name="destinationUrl" value={createUrl.destinationUrl} onChange={handleCreateUrl} placeholder='https://web.whatsapp.com/'

                />
              </div>
              <div className={style.Urlinput}>
                <label htmlFor="remarks">Remarks <span>*</span></label>
                <textarea name="remarks" id="remarks" placeholder='Add remarks' value={createUrl.remarks} onChange={handleCreateUrl}>Add remarks</textarea>
              </div>

              <div className={style.toggle}>
                <p>Link Expiration</p>
                <label className={style.switch}>
                  <input type="checkbox" checked />
                  <span className={`${style.slider} ${style.round}`}></span>
                </label>
              </div>
              {/* Date and Time Picker */}
              <div className={style.date_time_container}>
                {/* Display formatted date */}
                <input
                  type="text"
                  value={formatDate(selectedDate)}
                  readOnly
                  className="date_display"
                />
                {/* Calendar icon to toggle DatePicker */}
                <FiCalendar
                  className={style.calendar_icon}
                  onClick={() => setShowDatePicker((prev) => !prev)}
                />

                {showDatePicker && (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      // setShowDatePicker(false); // Close the calendar after selecting a date
                    }}
                    // showTimeSelect
                    dateFormat="Pp"
                    minDate={new Date()}
                    inline // Show inline calendar
                    className="datepicker"
                  />
                )}
              </div>

              <div className={style.createUrl_Btns}>
                <div>
                  <div className={style.clearBtn} onClick={clear}>Clear</div>
                </div>
                <div>
                  <button className={style.createBtn} type='submit'>Save</button>

                </div>
              </div>
            </form>
            {/* </div> */}

          </div>
        ) :
          <div>
            {showCreateForm && (
              <div className={style.Createlinks_container}>
                <div className={style.createLinkhead}>
                  <span className={style.newSpan}>New Link</span>
                  <span className={style.crossSpan} onClick={handleHideCross}>X</span>
                </div>
                <form onSubmit={handleCreateUrlSubmit} className={style.create_form}>
                  <div className={style.Urlinput}>
                    <label htmlFor="destinationurl">Destination Url <span>*</span></label>
                    <input type="text" name="destinationUrl" value={createUrl.destinationUrl} onChange={handleCreateUrl} placeholder='https://web.whatsapp.com/'

                    />
                  </div>
                  <div className={style.Urlinput}>
                    <label htmlFor="remarks">Remarks <span>*</span></label> <br />
                    <textarea name="remarks" id="remarks" value={createUrl.remarks} onChange={handleCreateUrl}>Add remarks</textarea>
                  </div>

                  <div className={style.toggle}>
                    <p>Link Expiration</p>

                    <label className={style.switch}>
                      <input type="checkbox" checked />
                      <span className={`${style.slider} ${style.round}`}></span>
                    </label>

                  </div>
                  {/* Date and Time Picker */}
                  <div className={style.date_time_container}>

                    {/* Display formatted date */}
                    <input
                      type="text"
                      value={formatDate(selectedDate)}
                      readOnly
                      className="date_display"
                    />
                    {/* Calendar icon to toggle DatePicker */}
                    <FiCalendar
                      className="calendar_icon"
                      onClick={() => setShowDatePicker((prev) => !prev)}
                    />

                    {showDatePicker && (
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                          setSelectedDate(date);
                          // setShowDatePicker(false); // Close the calendar after selecting a date
                        }}
                        // showTimeSelect
                        dateFormat="Pp"
                        minDate={new Date()}
                        inline // Show inline calendar
                        className="datepicker"
                      />
                    )}
                  </div>

                  <div className={style.createUrl_Btns}>
                    <div>
                      <div className={style.clearBtn} onClick={clear}>Clear</div>
                    </div>
                    <div>
                      <button className={style.createBtn} type='submit'>Create new</button>

                    </div>
                  </div>
                </form>

              </div>
            )}
          </div>
        }
      </div>
    </div>
  )
};

export default Linkpage
