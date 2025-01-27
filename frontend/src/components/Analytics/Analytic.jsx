import React, { useState, useEffect  } from 'react';
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
                <tr>
                  <th>Timestamp</th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>ip address</th>
                  <th>User Device</th>
                </tr>
      
                {analyticData.map((item, index) => (
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
                    <td>{item.destinationUrl}</td>
                    <td>{item.shortUrl}</td>
                    <td>{item.ipAddress }</td>
                    <td>{item.deviceType}</td>
                  </tr>
                ))}
              </table>
            </div>
    </>
  )
}

export default Analytic

