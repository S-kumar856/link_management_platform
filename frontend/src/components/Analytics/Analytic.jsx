import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './Analytic.module.css'


const Analytic = () => {

  const [analyticData, setAnalyticData] = useState([])
  useEffect(() => {
    AnalyticUrl();
  }, [])

  const AnalyticUrl = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/url", {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      console.log(response.data)
      setAnalyticData(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className={style.dashborad_Maincontainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>ip address</th>
              <th>User Device</th>
            </tr>
          </thead>

          <tbody>
            {analyticData.map((item, index) => (
              item.deviceDetails.map((device, deviceIndex) => (
                <tr key={`${index}-${deviceIndex}`}>
                  <td>
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td>{item.destinationUrl}</td>
                  <td>{item.shortUrl}</td>
                  <td>{device.ipAddress || "N/A"}</td>
                  <td>{device.deviceType || "N/A"}</td>
                </tr>
              ))
            ))}
          </tbody>

        </table>
      </div>
    </>
  )
}

export default Analytic

