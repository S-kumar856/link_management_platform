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
      <div className={style.container}>
        <div className={style.linksContainer}>
          <table className={style.tableContainer}>
            <thead className={style.tableHeader}>
              <tr>
                <th>Timestamp</th>
                <th className={style.originalLink}>Original Link</th>
                <th className={style.shortLink}>Short Link</th>
                <th>ip address</th>
                <th>User Device</th>
              </tr>
            </thead>

            <tbody>
              {analyticData.map((item, index) => (
                item.deviceDetails.map((device) => (
                  <tr key={`${index}`} className={style.tableRow}>
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
                    <td><div className={style.original}>{item.destinationUrl}</div></td>
                    <td><div className={style.short}> {item.shortUrl}</div></td>
                    <td className={style.remarks}>{device.ipAddress || "N/A"}</td>
                    <td className={style.remarks} >{device.deviceType || "N/A"}</td>
                  </tr>
                ))
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  )
}

export default Analytic

