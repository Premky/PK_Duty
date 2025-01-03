import axios from 'axios';
import React, { useEffect, useState } from 'react'
// import Icon from '../../Icon';
// import CustomModal from '../../Utils/CustomModal';
import { Link } from 'react-router-dom';

const Notice_News = () => {

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [fetchNotice, setFetchNotice] = useState([]);

  const fetchNotices = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/display/notices`);
      if (result.data.Status) {
        setFetchNotice(result.data.Result);
        // alert(fetchNotice);
      } else {
        alert(result.data.Result);
        console.error(result.data.Result);
      }
    } catch (err) {
      console.log(err);
      alert('Failed to fetch notices. Please try again later.');
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [BASE_URL])

  return (
    <>
      <table className='table'>
        <thead>
          <tr>
            <td>मिति</td>
            <td>सुचना</td>
            <td></td>
            {/* <td></td> */}
          </tr>
        </thead>
        <tbody>
          {fetchNotice.map((notice, index) => (
            <tr key={notice.id}>
              <td>{notice.date}</td>
              <td>{notice.subject}</td>
              <td>
                <CustomModal
                  title={notice.subject}
                  buttonText={<span><Icon iconName="Eye" style={{ color: 'black', fontSize: '1em' }} /></span>}
                  fileType={notice.file.endsWith('.pdf') ? 'pdf' : 'image'}
                >
                  {`${BASE_URL}/${notice.file}`}
                  {/* <img src={`${BASE_URL}/${notice.file}`} alt={`Preview of ${notice.subject}`} height='700vh' /> */}
                </CustomModal>
              </td>
              {/* <td>
                <a href={`${BASE_URL}/${notice.file}`} target="_blank" rel="noopener noreferrer">
                  <Icon iconName="Download" style={{ color: 'blue', fontSize: '1em' }} />
                </a>

              </td> */}

            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Notice_News