import React, { useEffect, useState } from 'react';
import style from './Linkpage.module.css'
import axios from 'axios';
import { toast } from 'react-toastify';
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
  const [currentId, setCurrentId] = useState(null);
  const [deleteId, setDeleteId] = useState(null)
  const { showCreateForm, setShowCreateForm, searchTerm } = useAppContext();
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expiryDate, setexpiryDate] = useState(null);

  const [createUrl, setCreateUrl] = useState({
    destinationUrl: "",
    remarks: "",
    expiryDate: null,
  });

  // ------------------------------------------------------------
  // Handle toggle change
  const handleToggleChange = (e) => {
    setExpirationEnabled(e.target.checked);
    if (!e.target.checked) {
      setexpiryDate(null);
      setCreateUrl(prev => ({
        ...prev,
        expiryDate: null
      }));
    } else {
      // Set default expiration to selected date when enabling
      setexpiryDate(selectedDate);
      setCreateUrl(prev => ({
        ...prev,
        expiryDate: selectedDate
      }));
    }
  };

  // Modify your existing date change handler
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (expirationEnabled) {
      setexpiryDate(date);
      setCreateUrl(prev => ({
        ...prev,
        expiryDate: date
      }));
    }
  }
// -----------------------------------
  // search filter function
  const filteredRemarks = linkpageLinks.filter((item) =>
    item.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUrl = (e) => {
    const { name, value } = e.target;
    setCreateUrl({ ...createUrl, [name]: value })

  };

  useEffect(() => {
    getUrl();
  }, [])

  // fecthing the url from the backend  
  const getUrl = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/url", {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      setLinkpageLinks(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleCreateUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/url/createLinks',
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,
          expiryDate: expirationEnabled ? expiryDate : null,
        },
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      if (response.data) {
        toast.success("Url created successfully");
        resetForm();
        getUrl();
        setCreateUrl({ destinationUrl: "", remarks: "", expiryDate: null });

      }

    } catch (error) {
      console.log("error in creating url:", error)
      toast.error("error in creating url");
      // setShowCreateForm(false)
    }

  };

  const updateId = (item) => {
    setIsEditing(true);
    setCurrentId(item._id);
    setCreateUrl({
      destinationUrl: item.destinationUrl,
      remarks: item.remarks,
    })
    setShowCreateForm(true);
  };

  const deleteID = (item) => {
    setDeleteId(item._id)
    setShowDeleteModel(true)
  }



  const handleUpdateCreateUrl = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/api/url/updateLink/${currentId}`,
        {
          destinationUrl: createUrl.destinationUrl,
          remarks: createUrl.remarks,
          expiryDate: expirationEnabled ? expiryDate : null,

        },
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );
      if (response.data) {

        toast.success("Url updated successfully");
        resetForm();
        getUrl();
      }
      // setShowCreateForm(false)
      // setIsEditing(false);
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

  // deleting the url 
  const deleteUrl = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/url/deleteLink/${deleteId}`,
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
      // Remove deleted folder from the list
      const updatedDashboardLink = linkpageLinks.filter((url) => url._id !== currentId)
      setLinkpageLinks(updatedDashboardLink);// Update the state
      toast.success("Url deleted successfully");
      resetForm();
      getUrl();
    }
    catch (error) {
      console.error("Error deleting Url:", error);
      toast.error("Error deleting Url");
    }
  };

  const resetForm = () => {
    setCreateUrl({ destinationUrl: "", remarks: "", expiryDate: null });
    setIsEditing(false);
    setShowCreateForm(false);
    setCurrentId(null);
    setShowDeleteModel(false)
    setDeleteId(null)
    setExpirationEnabled(false);
    setexpiryDate(null);
    setSelectedDate(new Date());
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied successfully!");
    } catch (error) {
      toast.error("Failed to copy link", error);
    }
  };

  return (
    <>
      {filteredRemarks.length > 0 ? (
        <div className={style.container}>
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
                {filteredRemarks.map((remark, index) => (
                  <tr key={index} className={style.tableRow}>
                    <td>
                      {new Date(remark.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td><div className={style.original}>{remark.destinationUrl}</div></td>
                    <td className={style.shortEdit}>
                      <div className={style.short}>
                        {remark.shortUrl}
                      </div>
                      <span className={style.copyIcon} onClick={() => handleCopy(remark.shortUrl)}>📋</span>
                    </td>
                    <td className={style.remark}>{remark.remarks}</td>
                    <td className={style.clicks}>{remark.clickCount}</td>
                    <td className={style.status}>
                      <span className={remark.status === "Active" ? style.active : style.inactive}>
                        {remark.status}
                      </span>
                    </td>
                    <td className={style.btns}>
                      <button className={style.editButton} onClick={() => updateId(remark)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className={style.deleteButton} onClick={() => deleteID(remark)}>
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>


          {showCreateForm && (

            <div className={style.createLinkModel}>
              <div className={style.Createlinks_container}>
                <div className={style.createLinkhead}>
                  <span className={style.newSpan}>{isEditing ? 'Edit Link' : 'New Link'}</span>
                  <span className={style.crossSpan} onClick={resetForm}>X</span>
                </div>
                <form onSubmit={isEditing ? handleUpdateCreateUrl : handleCreateUrlSubmit} className={style.create_form}>


                  <div className={style.Urlinput}>
                    <label htmlFor="destinationurl">Destination Url <span>*</span></label>

                    <input type="text" name="destinationUrl"
                      value={createUrl.destinationUrl}
                      onChange={handleCreateUrl}
                      placeholder='https://web.whatsapp.com/'
                    />

                  </div>
                  <div className={style.Urlinput}>
                    <label htmlFor="remarks">Remarks <span>*</span></label> <br />
                    <textarea name="remarks" id="remarks" value={createUrl.remarks} onChange={handleCreateUrl} required>Add remarks</textarea>
                  </div>

                  <div className={style.toggle}>
                    <p>Link Expiration</p>
                    <label className={style.switch}>
                      <input
                        type="checkbox"
                        checked={expirationEnabled}
                        onChange={handleToggleChange}
                      />
                      <span className={`${style.slider} ${style.round}`}></span>
                    </label>
                  </div>

                  {/* Date and Time Picker */}
                  {expirationEnabled && (
                    <div className={style.date_time_container}>
                      <input
                        type="text"
                        value={expiryDate ? formatDate(expiryDate) : ''}
                        readOnly
                        className="date_display"
                      />
                      <FiCalendar
                        className="calendar_icon"
                        onClick={() => setShowDatePicker((prev) => !prev)}
                      />
                      {showDatePicker && (
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => {
                            handleDateChange(date);
                            setShowDatePicker(false);
                          }}
                          // showTimeSelect
                          dateFormat="Pp"  
                          minDate={new Date()}
                          block
                          className="datepicker"
                        />
                      )}
                    </div>
                  )}
                  <div className={style.createUrl_Btns}>
                    <div>
                      <div className={style.clearBtn} onClick={resetForm}>Clear</div>
                    </div>
                    <div>
                      <button className={style.createBtn} type='submit'> {isEditing ? 'Save' : 'Create new'}</button>

                    </div>
                  </div>
                </form>

              </div>
            </div>

          )};

          {/* delete showmodel  */}

          {showDeleteModel && (
            <div className={style.overlay}>
              <div className={style.delete_model}>
                <span onClick={resetForm}>x</span>
                <div className={style.delete_content}>
                  <p> Are you sure, you want to remove it ? </p>
                  <div className={style.deleteModel_Btns}>
                    <button className={style.noBtn} onClick={resetForm}>NO</button>
                    <button className={style.yesBtn} onClick={deleteUrl}>YES</button>
                  </div>

                </div>

              </div>
            </div>
          )}
        </div>


      ) : (
        <p>No results found.</p>)}
    </>

  )
};

export default Linkpage
