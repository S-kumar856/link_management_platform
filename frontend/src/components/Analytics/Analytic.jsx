import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './Analytic.module.css'


const Analytic = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [analyticData, setAnalyticData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    AnalyticUrl(currentPage);
  }, [currentPage])

  const AnalyticUrl = async (page = 1) => {
    try {
      const response = await axios.get(`${apiUrl}/api/url/analytics?page=${page}&limit=7`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      console.log(response.data)
      setAnalyticData(response.data.clicks);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    }
    catch (error) {
      console.log(error)
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
    {analyticData.length > 0 ?(
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
                  <td className={style.remarks}>{item.ipAddress || "N/A"}</td>
                  <td className={style.remarks} >{item.deviceType || "N/A"}</td>
                </tr>

              ))}
            </tbody>

          </table>
        </div>

        {/* Pagination Controls */}
        <div className={style.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className={style.pageNum}>
            <span>{currentPage}</span>
            <span>{totalPages}</span>
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    ):(<p>No Data Links available</p>)}
      
    </>
  )
}

export default Analytic

