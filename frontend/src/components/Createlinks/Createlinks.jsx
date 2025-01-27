import React, { useState } from 'react'
import style from './Createlinks.module.css'
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';


const Createlinks = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [createUrl, setCreateUrl] = useState({
        destinationUrl: '',
        remarks: ''
    });

    const handleCreateUrl = (e) => {
        const { name, value } = e.target;
        setCreateUrl({ ...createUrl, [name]: value })
    }

    const handleCreateUrlSubmit = async (e) => {
        e.preventDefault();
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

            console.log(response.data)

            if (response.data.success) {
                alert("Url created successfully");
            }


        } catch (error) {
            console.log("error in creating url:", error)
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

    // sending data to the backend 


    return (
        <div className={style.Createlinks_container}>
            <form onSubmit={handleCreateUrlSubmit}>
                <div className={style.destination_input}>
                    <label htmlFor="destinationurl">Destination Url <span>*</span></label> <br />
                    <input type="text" name="destinationUrl" value={createUrl.destinationUrl} onChange={handleCreateUrl} placeholder='https://web.whatsapp.com/'

                    />
                </div>
                <div className={style.remarks_input}>
                    <label htmlFor="remarks">Remarks <span>*</span></label> <br />
                    <textarea name="remarks" id="remarks" value={createUrl.remarks} onChange={handleCreateUrl}>Add remarks</textarea>
                </div>

                <div className={style.toggle}>
                    <p>Link Expiration</p>
                    <p>toggle</p>
                </div>
                {/* Date and Time Picker */}
                <div className="date_time_container">
                    <div className="date_time_display">
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
                    </div>

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
                    <button className={style.createBtn} type='submit'>Create new</button>
                    <button className={style.clearBtn}>Clear</button>
                </div>
            </form>

        </div>
    )
}

export default Createlinks
