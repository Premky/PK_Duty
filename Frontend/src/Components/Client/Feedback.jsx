import React from 'react'

const Feedback = () => {
  return (
    <>
      <div className='d-flex justify-content-center align-items-center vh-100 loginPage' style={{background:'#33ffe6'}}>
        <div className='p-3 rounded w-40 border loginForm bg-primary text-white fs-4'>
          <div>सुझाव तथा प्रतिकृया</div>
          <form action=""  >
            <div className="row">
              <div className='col mb-3'>
                <label htmlFor="name"><strong>नाम:</strong></label>
                <input type="text" name='name' autoComplete='off' placeholder='पुरा नाम'
                  className='form-control' rounded-0='true' />
                {/* onChange={(e) => setValues({ ...values, username: e.target.value })} /> */}
              </div>
              <div className='col mb-3'>
                <label htmlFor="email"><strong>इमेल:</strong></label>
                <input type="text" name='email' autoComplete='off' placeholder='ईमेल'
                  className='form-control' rounded-0='true' />
                {/* onChange={(e) => setValues({ ...values, username: e.target.value })} /> */}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="feedback"><strong>जनगुनासो</strong></label>
              <textarea name="" id="" className='form-control' rounded-0='true'></textarea>
            </div>
            <div className="row mb-3">
              <div className="col">
                <button className='btn-success btn btn-lg'>Submit</button>
              </div>
            <div className="col">
                <button className='btn-danger btn btn-lg'>Clear</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Feedback