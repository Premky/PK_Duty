import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import NepaliDate from 'nepali-datetime';
import Icon from './../Icon'
import './Style/employee.css'

//For React Modal using Material UI 

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}



//End For React Modal using Material UI

const Employee = () => {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false); //For displaying loading state
    const [editing, setEditing] = useState(false);
    const [ranks, setRanks] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentEmp, setCurrentEmp] = useState(null);
    const [fetchEmp, setFetchEmp] = useState([])

    //Open For Modal
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    //Close For Modal

    const fetchEmployees = async () => {
        try {
            const result = await axios.get(
                `${BASE_URL}/display/employee`);
            if (result.data.Status) {
                setFetchEmp(result.data.Result);
            } else {
                console.log(result.data.Result);
            }
        } catch (err) {
            setError("Failed to fetch employees.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); //set the image preview
            };
            reader.readAsDataURL(file); //Read the file as a data URL
        }
    };

    const fetchRank = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/display/ranks`)
            if (result.data.Status) {
                setRanks(result.data.Result)
                // console.log(result.data.Result)
            } else {
                alert(result.data.Result)
                console.error(result.data.Result)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleEdit = (emcdp) => {
        setCurrentEmp(emp);
        setEditing(true);
        setValue("emp_id", emp.emp_id);
        setValue("name_np", emp.name_np);
        setValue("name", emp.name);
        setValue("gender", emp.gender);
        setValue("rank_id", emp.rank_id);
        setValue("merit_no", emp.merit_no);
        setValue("contact", emp.contact);
        setValue("email", emp.email);
        setValue("remarks", emp.remarks);
        setValue("is_active", emp.is_active);
        setImagePreview(emp.photo);
    }

    const onFormSubmit = async (data) => {
        setLoading(true); // Start loading
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]));
            
            const url = editing ? `${BASE_URL}/auth/update_employee/${currentEmp.id}` : `${BASE_URL}/auth/add_employee`;
            const method = editing ? 'PUT' : 'POST';
            const result = await axios({
                method,
                url,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (result.data.Status) {
                alert(`Employee ${editing ? 'updated' : 'added'} successfully!`);
                reset();
                setEditing(false);
                setCurrentEmp(null);
                setImagePreview(null);
                fetchEmployees();
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.error('Submission error:', err);
            alert('An error occurred. Please try again.',);
            // alert(err)
        } finally {
            setLoading(false); // End loading
        }
    };


    const handleClear = () => {
        if (loading) {
            setLoading(false);
        } else {
            reset();
            setEditing(false);
            setCurrentEmp(null);
            setImagePreview(null);
            fetchEmployees();
        }
    };

    useEffect(() => {
        fetchRank();
        fetchEmployees();
    }, [BASE_URL])

    return (
        <div className="container-fluid m-0 p-0">
            <div className="row flex-nowrap">
                <div className="p-2 justify-content shadow text-center">
                    <h4>{editing ? 'Edit Employee' : 'Add Employee'}</h4>

                    <div className="d-flex flex-column px-0 pt-0 min-vh-100">

                        <form className="row g-10 m-2" onSubmit={handleSubmit(onFormSubmit)}>
                            <div className="row">
                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="emp_id">कर्मचारी संकेत नं. <span>*</span></label>
                                    <input
                                        type="text"
                                        {...register("emp_id", { required: "This field is required" })} //Use this instead of name='emp_id'
                                        placeholder="कर्मचारी संकेत नं."
                                        className="form-control rounded-0"
                                    // value=''
                                    />
                                    {errors.emp_id && <span className="text-danger">{errors.emp_id.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="name_np">नामथर (नेपालीमा)</label>
                                    <input
                                        type="text"
                                        {...register("name_np", { required: "This field is required" })} //Use this instead of name=
                                        placeholder="नाम नेपालीमा"
                                        className="form-control rounded-0"
                                    // value=''
                                    />
                                    {errors.name_np && <span className="text-danger">{errors.name_np.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="name">नामथर (अंग्रेजी)</label>
                                    <input
                                        type="text"
                                        {...register("name", { required: "This field is required" })} //Use this instead of name=
                                        placeholder="Name (In English)"
                                        className="form-control rounded-0"
                                    // value=''
                                    />
                                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="gender">लिङ्ग</label>
                                    <select
                                        {...register("gender", { required: "This field is required" })} //Use this instead of name=
                                        className='form-control rounded-0'
                                        defaultValue=''
                                    >
                                        <option value="" disabled>लिङ्ग</option>
                                        <option value="M">पुरुष</option>
                                        <option value="F">महिला</option>
                                        <option value="O">अन्य</option>
                                    </select>
                                    {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="rank">पद</label>
                                    <select
                                        {...register("rank_id", { required: "This field is required" })} //Use this instead of name=
                                        className='form-control rounded-0'
                                        defaultValue=''                                        >
                                        <option value='' disabled>पद</option>
                                        {
                                            ranks.map((n, index) => (
                                                <option value={n.id} key={index}>{n.rank_np_name}</option>
                                            ))
                                        }
                                    </select>
                                    {errors.rank && <span className="text-danger">{errors.rank.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="merit_no">वरीयता</label>
                                    <input
                                        type="number"
                                        {...register("merit_no", { required: "This field is required" })} //Use this instead of name=
                                        placeholder="वरीयता"
                                        className="form-control rounded-0"
                                    // value=''
                                    />
                                    {errors.merit_no && <span className="text-danger">{errors.merit_no.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="contact">सम्पर्क</label>
                                    <input
                                        type="text"
                                        {...register("contact", { required: "This field is required" })} //Use this instead of name=
                                        placeholder="सम्पर्क नं."
                                        className="form-control rounded-0"
                                    // value=''
                                    />
                                    {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="email">इमेल</label>
                                    <input
                                        type="text"
                                        {...register("email", { required: "This field is required" })} //Use this instead of name=
                                        placeholder="Email"
                                        className="form-control rounded-0"
                                    // value=''
                                    />
                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="photo">फोटो</label>
                                    <input
                                        type="file"
                                        {...register("photo", { onChange: onImageChange })} //Use this instead of name=
                                        placeholder="Photo"
                                        className="form-control rounded-0"
                                    // value=''
                                    />
                                </div>
                                {imagePreview && (
                                    <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                        <img src={imagePreview} alt='Preview' style={{ width: '100px', height: 'auto' }} />
                                    </div>
                                )}

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="remarks">कैफियत</label>
                                    <input
                                        type="text"
                                        {...register("remarks")} //Use this instead of name=
                                        placeholder="Remarks"
                                        className="form-control rounded-0"
                                    // value=''
                                    />
                                </div>

                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <label htmlFor="is_active">अवस्था</label>
                                    <select
                                        {...register("is_active", { required: "This field is required" })} //Use this instead of name=
                                        className='form-control rounded-0'
                                        defaultValue=''
                                    >
                                        <option value='' disabled>अवस्था</option>
                                        <option value='1'>सक्रिय</option>
                                        <option value='0'>निस्कृिय</option>
                                    </select>
                                    {errors.is_active && <p className="text-danger">{errors.is_active.message}</p>} {/* Display error message */}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <button className='btn btn-primary' disabled={loading}>
                                        {editing ? (loading ? 'Updating' : 'Update') :
                                            (loading ? 'Saving...' : 'Save')}
                                    </button>
                                </div>
                                <div className="col-xl-3 col-md-6 col-sm-12 pt-2">
                                    <button type='button' onClick={handleClear} className='btn btn-warning'>
                                        {loading ? 'Stop' : 'Clear'}
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="row flex-nowrap p-2">
                            <table className='table table-border table-font'>
                                <tr>
                                    <th>सि.नं.</th>
                                    <th>कर्मचारी संकेत नं.</th>
                                    <th>नाम (नेपालीमा)</th>
                                    <th>नाम (अंग्रेजीमा)</th>
                                    <th>लिङ्ग</th>
                                    <th>पद</th>
                                    <th>वरीयता</th>
                                    <th>सम्पर्क</th>
                                    <th>इमेल</th>
                                    <th>फोटो</th>
                                    <th>कैफियत</th>
                                    <th>#</th>
                                </tr>
                                {fetchEmp.map((fe, index) => (
                                    <tr key={fe.id}>
                                        <td>{index}</td>
                                        <td>{fe.emp_id}</td>
                                        <td>{fe.name_np}</td>
                                        <td>{fe.name}</td>
                                        <td>{fe.gender}</td>
                                        <td>{fe.rank_np_name}</td>
                                        <td>{fe.merit_no}</td>
                                        <td>{fe.contact}</td>
                                        <td>{fe.email}</td>
                                        <td>{fe.photo}</td>
                                        <td>{fe.remarks}</td>
                                        <td>
                                            <button name='edit' className='btn btn-sm bg-primary'
                                                id={fe.id}
                                                onClick={() => handleEdit(fe)}>
                                                <Icon iconName="Pencil"
                                                    style={{ color: 'white', fontSize: '1em' }}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

Employee.propTypes = {
    // Define props if needed
};

export default Employee;
