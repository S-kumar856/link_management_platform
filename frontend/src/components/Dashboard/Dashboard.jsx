import React from 'react'
import style from './Dashboard.module.css'

const Dashboard = () => {
  return (
    <div className={style.Dashboard_container}>
      <div className={style.totalClick}>
        <span>Total Clicks</span>
        <p className={style.clickRes}>1234</p>
      </div>
      <div className={style.DivBox}>
        <div className={style.dataWise_clickBox}>
          <p>Date-wise Clicks</p>
        </div>
        <div className={style.clickDevice}>
         <p>Click Devices</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
